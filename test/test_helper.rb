ENV['RAILS_ENV'] ||= 'test'

if ENV['COVERAGE'] == 'true'
  require 'simplecov'
  SimpleCov.start 'rails' do
    merge_timeout 3600
    coverage_dir 'tmp/coverage'
    track_files '{app,lib}/**/*.{rb,rake}'
  end

  puts "performing coverage analysis"
end

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require "#{Rails.root}/test/data_helper.rb"

if ENV['RETRY'] == 'true'
  require 'minitest/retry'
  Minitest::Retry.use!
end

class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers

  DatabaseCleaner.clean_with :deletion
  DatabaseCleaner.clean

  # TODO: rebase test data on seed data once seed data is ready
  # load "#{Rails.root}/db/seeds.rb"

  # Use Sunspot's in-memory stub session by default for tests so we don't
  # require a running Solr instance. If you want to run tests against a
  # real Solr, set the environment variable REAL_SOLR=true when running the
  # tests and provide a test Solr instance.  
  unless ENV['REAL_SOLR'] == 'true'
    Sunspot.session = Sunspot::Rails::StubSessionProxy.new(Sunspot.session)
  end

  DataHelper.test_data

  self.use_transactional_tests = true

  File.truncate "#{Rails.root}/log/test.log", 0

  def setup
    ActionMailer::Base.deliveries = []
    Rails.application.routes.default_url_options[:host] = 'test.portal.oral-history.localhost:47001'

    system 'mkdir', '-p', "#{Rails.root}/public/test/"
  end

  def teardown
    system 'rm', '-rf', "#{Rails.root}/public/test/"
  end

  def reload_page
    page.evaluate_script("window.location.reload()")
  end

  def links_from_email(email)
    body = (
      !email.body.multipart? ?
      email.body :
      email.body.parts.find{|p| p.content_type.match?(/^text\/plain/)}
    )
    body.to_s.scan(/http[^\n> ]+/).map{|l| l.gsub(/=0D/, '')}
  end

  alias_method :devise_login_as, :login_as
  def login_as(user_or_email, password = 'password')
    unless system_test?
      return devise_login_as user_or_email
    end


    # Ensure a clean browser session and open the sign-in page directly. This
    # avoids relying on header UI which can be hidden/changed between states.
    Capybara.reset_sessions!
    visit '/en/users/sign_in'

    fill_in 'Email', with: user_or_email
    fill_in 'Password', with: password
    # Some forms use 'Login' others 'Log in' or a button element — try the
    # common labels and fall back to submitting the form.
    if has_button?('Login')
      click_on 'Login'
    elsif has_button?('Log in')
      click_on 'Log in'
    else
      find('form').native.submit
    end

    # Sanity-check: after signing in we expect to see an Account/Logout button
    begin
      within '.SessionButtons' do
        unless has_button?('Account') || has_link?('Account') || has_button?('Logout') || has_link?('Logout')
          # save diagnostics to tmp for investigation
          File.write(Rails.root.join('tmp', "login_failure_#{user_or_email}.html"), page.html)
          if Capybara.respond_to?(:save_screenshot)
            Capybara.save_screenshot(Rails.root.join('tmp', "login_failure_#{user_or_email}.png")) rescue nil
          end
          raise Capybara::ElementNotFound, "Login did not produce Account/Logout button for #{user_or_email}. Saved HTML to tmp/login_failure_#{user_or_email}.html"
        end
      end
    rescue Capybara::ElementNotFound
      # If SessionButtons region not present at all, also dump page
      File.write(Rails.root.join('tmp', "login_failure_#{user_or_email}.html"), page.html)
      raise
    end
  end

  def logout
    visit '/'
    click_on 'Account'
    click_on 'Logout'
  end

  def system_test?
    return false unless Kernel.const_defined?(:ApplicationSystemTestCase)

    self.is_a?(::ApplicationSystemTestCase)
  end

  # Helper to check if a Solr server is reachable. Tests that require a
  # running Solr should call `skip_unless_solr!` to avoid failing in CI
  # environments where Solr is not started. You can force tests to use a
  # real Solr by setting `REAL_SOLR=true` when running the suite.
  def solr_running?
    return true if ENV['REAL_SOLR'] == 'true'

    begin
      solr_url = (Sunspot.config && Sunspot.config['solr'] && Sunspot.config['solr']['url']) || ENV['SOLR_URL'] || 'http://127.0.0.1:8983/solr'
      uri = URI.parse(solr_url)
      Net::HTTP.start(uri.host, uri.port, open_timeout: 1, read_timeout: 1) do |http|
        res = http.head(uri.path.empty? ? '/' : uri.path)
        return res.code.to_i < 500
      end
    rescue StandardError
      false
    end
  end

  def skip_unless_solr!
    skip "Solr not available (set REAL_SOLR=true to enable)" unless solr_running?
  end
end
