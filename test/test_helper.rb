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

class ActiveSupport::TestCase
  DatabaseCleaner.clean_with :truncation
  DatabaseCleaner.clean

  # TODO: rebase test data on seed data once seed data is ready
  # load "#{Rails.root}/db/seeds.rb"
  load "#{Rails.root}/test/test_data.rb"

  self.use_transactional_tests = true

  File.truncate "#{Rails.root}/log/test.log", 0

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

  def login_as(email, password = 'password')
    visit '/'
    within '.flyout-login-container' do
      click_on 'Login'
    end
    fill_in 'Email', with: email
    fill_in 'Password', with: password
    click_on 'Login'
  end
end
