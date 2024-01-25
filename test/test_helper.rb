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
  def login_as(user_or_email, password = 'password')
    unless system_test?
      return devise_login_as user_or_email
    end
    
    visit '/'
    within '.flyout-login-container' do
      click_on 'Login'
    end
    fill_in 'Email', with: user_or_email
    fill_in 'Password', with: password
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
end
