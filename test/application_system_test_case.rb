require "test_helper"

Capybara.configure do |c|
  url = URI.parse(OHD_DOMAIN)

  c.server_host = url.host
  c.server_port = url.port

  # c.default_max_wait_time = 30
end

Selenium::WebDriver.logger.level = :error

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase

  opts = [
    "--user-data-dir=#{Dir.mktmpdir}",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    '--enable-features=WebAuthentication',
    '--allow-insecure-localhost',
    '--disable-blink-features=AutomationControlled',
  ]

  if ENV['HEADLESS'] == 'true'
    opts << '--headless=new'  # Use new headless mode
    opts << '--disable-gpu'
  end

  driven_by :selenium, using: :chrome, screen_size: [1400, 1400] do |options|
    opts.each do |arg|
      options.add_argument(arg)
    end
  end

  def teardown
    # Force a new browser session for the next test
    Capybara.reset_sessions!
    super
  end

  private

  def add_virtual_authenticator
    return if @virtual_authenticator
    
    # Try to add authenticator, skip if one already exists
    begin
      @virtual_authenticator = page.driver.browser.add_virtual_authenticator(
        protocol: 'ctap2',
        transport:  'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserConsenting: true,
        isUserVerified: true
      )
    rescue Selenium::WebDriver::Error::InvalidArgumentError => e
      if e.message.include?("one internal authenticator")
        # Browser session already has an authenticator, which shouldn't happen
        # but we'll reset and retry
        Capybara.reset_sessions!
        retry
      else
        raise
      end
    end
  end

end
