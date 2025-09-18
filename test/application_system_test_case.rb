require "test_helper"

Capybara.configure do |c|
  url = URI.parse(OHD_DOMAIN)

  c.server_host = url.host
  c.server_port = url.port

  # c.default_max_wait_time = 30
end

Selenium::WebDriver.logger.level = :error

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  if ENV['HEADLESS'] == 'true'
    driven_by :selenium_headless
  else
    driven_by :selenium, using: :firefox, screen_size: [1400, 1400]
  end

  # Ensure each system test starts with a clean browser session. Some tests
  # leave the browser logged in which can make subsequent tests fail when
  # expecting a Login button. Reset sessions before and after each test.
  setup do
    Capybara.reset_sessions!
  end

  teardown do
    Capybara.reset_sessions!
  end
end
