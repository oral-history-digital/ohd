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
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  end

end
