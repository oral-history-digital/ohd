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
  def login_as(user_or_email, password = 'Password123!')
    unless system_test?
      return devise_login_as user_or_email
    end

    # Ensure a clean browser session and open the sign-in page directly. This
    # avoids relying on header UI which can be hidden/changed between states.
    Capybara.reset_sessions!
    visit '/en/users/sign_in'

    fill_in 'user[email]', with: user_or_email
    fill_in 'user[password]', with: password
    click_on 'Login'
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

  def fill_registration_form(first_name:, last_name:, email:, password: 'Password123!', passkey_required: false, otp_required: false)
    visit '/'
    click_on 'Registration'
    fill_in 'First Name', with: first_name
    fill_in 'Last Name', with: last_name
    select 'Germany'
    fill_in 'Street', with: 'Am Dornbusch 13'
    fill_in 'City', with: 'Frankfurt am Main'
    fill_in 'Email', with: email
    fill_in 'Password', name: 'password', with: password
    fill_in 'Password confirmation', with: password
    check "user_passkey_required_for_login", visible: :all if passkey_required
    check "user_otp_required_for_login", visible: :all if otp_required
    check 'Terms of Use', visible: :all
    check 'Privacy Policy', visible: :all
    click_on 'Submit registration'
    assert_text 'Your registration has been successfully submitted!'
  end

  def confirm_registration_email
    mails = ActionMailer::Base.deliveries
    assert_equal 1, mails.count
    confirmation = mails.last
    assert_match /Confirmation of your registration/, confirmation.subject
    link = links_from_email(confirmation)[0]
    visit link
  end

  def register_passkey
    within_frame(find("iframe[src*='passkeys']")) do
      fill_in "nickname", with: "Test Chrome Device"
      click_button "commit"
      assert_text "Passkey successfully registered"
      click_on 'OK'
    end
  end

end
