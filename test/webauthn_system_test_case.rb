require "application_system_test_case"

class WebauthnSystemTestCase < ApplicationSystemTestCase
  
  def setup
    super
    add_virtual_authenticator
  end

  def teardown
    remove_virtual_authenticator
    super
  end

  private

  def remove_virtual_authenticator
    return unless @virtual_authenticator

    @virtual_authenticator.remove! if @virtual_authenticator.valid?
  rescue Selenium::WebDriver::Error::WebDriverError
    # Ignore cleanup failures when browser/session is already gone.
  ensure
    @virtual_authenticator = nil
  end

  def add_virtual_authenticator
    return if @virtual_authenticator

    begin
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
end
