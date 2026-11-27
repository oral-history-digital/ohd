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

# Capybara 3.40 uses a wildcard origin that Chrome 158 no longer accepts.
# Discard the browser to clear storage for every visited project domain.
module ChromeSessionReset
  # Resets the browser session without the unsupported wildcard CDP command.
  # @return [void]
  def reset!
    return super unless @browser && chromedriver_version >= 158

    quit
  end
end

if Gem.loaded_specs.fetch('capybara').version == Gem::Version.new('3.40.0')
  Capybara::Selenium::Driver::ChromeDriver.prepend(ChromeSessionReset)
end

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
