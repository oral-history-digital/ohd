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
    driven_by :selenium_headless, using: :chrome, screen_size: [1400, 1400] do |options|
      options.add_argument("--user-data-dir=#{Dir.mktmpdir}")
      options.add_argument("--disable-dev-shm-usage")
      options.add_argument("--no-sandbox")
    end
  else
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400] do |options|
      options.add_argument("--user-data-dir=#{Dir.mktmpdir}")
      options.add_argument("--disable-dev-shm-usage")
      options.add_argument("--no-sandbox")
    end
  end
end
