require "application_system_test_case"

class WebauthnSystemTestCase < ApplicationSystemTestCase
  
  def setup
    super
    add_virtual_authenticator
  end

  def teardown
    Capybara.reset_sessions!
    super
  end

  private

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
    rescue Selenium::WebDriver::Error::InvalidArgumentError => e
      if e.message.include?("one internal authenticator")
        Capybara.reset_sessions!
        retry
      else
        raise
      end
    end
  end
end
