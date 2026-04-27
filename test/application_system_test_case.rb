require "test_helper"
require_relative "system/helpers/form_testing_helper"
require_relative "system/helpers/form_fields_discovery_helper"
require_relative "system/helpers/redirect_system_test_helper"
require_relative "system/helpers/test_id_helper"

Capybara.configure do |c|
  url = URI.parse(OHD_DOMAIN)

  c.server_host = url.host
  c.server_port = url.port

  # c.default_max_wait_time = 30
end

Selenium::WebDriver.logger.level = :error

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include FormTestingHelper
  include FormFieldsDiscoveryHelper
  include RedirectSystemTestHelper

  chrome_opts = [
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-background-networking",
    "--disable-extensions",
    "--disable-sync",
    "--metrics-recording-only",
    "--mute-audio",
    "--allow-insecure-localhost",
    "--disable-blink-features=AutomationControlled",
    "--enable-features=WebAuthentication"
  ]

  if ENV['HEADLESS'] == 'true'
    chrome_opts << "--headless=new" # Use new headless mode
    chrome_opts << "--disable-gpu"
  end

  driven_by :selenium, using: :chrome, screen_size: [1400, 1400] do |options|
    chrome_opts.each { |arg| options.add_argument(arg) }
  end

  teardown do
    Capybara.reset_sessions!
  end
end
