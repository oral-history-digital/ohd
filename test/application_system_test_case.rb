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

      # Essential WebAuthn flags
    '--enable-features=WebAuthentication',
    '--allow-insecure-localhost',
  ]

  if ENV['HEADLESS'] == 'true'
    driven_by :selenium_headless, using: :chrome, screen_size: [1400, 1400] do |options|
      opts.each do |arg|
        options.add_argument(arg)
      end
    end
  else
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400] do |options|
      opts.each do |arg|
        options.add_argument(arg)
      end
    end
  end

  setup do
    visit "about:blank"
    add_virtual_authenticator
    sleep 0.5
  end

  private

  def add_virtual_authenticator
    @virtual_authenticator = page.driver.browser.add_virtual_authenticator(
      protocol: 'ctap2',
      transport:  'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserConsenting: true,
      isUserVerified: true
    )
  end
end
