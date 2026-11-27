require 'application_system_test_case'

# Checks the browser version used in CI and session reset behavior.
class BrowserSessionResetTest < ApplicationSystemTestCase
  test 'reset clears browser state without replacing the browser' do
    visit '/en?checked_ohd_session=true'
    assert_selector '.SessionButtons', wait: 15
    browser = page.driver.browser
    if ENV['CI_CHROME_VERSION'].present?
      assert_equal ENV['CI_CHROME_VERSION'], browser.capabilities.browser_version
    end

    page.execute_script(<<~JS)
      document.cookie = 'reset_test=value; path=/';
      localStorage.setItem('reset_test', 'value');
    JS
    assert_match(/(?:^|; )reset_test=value(?:;|$)/, page.evaluate_script('document.cookie'))
    assert_equal 'value', page.evaluate_script("localStorage.getItem('reset_test')")

    Capybara.reset_sessions!
    assert_same browser, page.driver.browser

    visit '/en?checked_ohd_session=true'
    assert_selector '.SessionButtons', wait: 15
    assert_no_match(/(?:^|; )reset_test=/, page.evaluate_script('document.cookie'))
    assert_nil page.evaluate_script("localStorage.getItem('reset_test')")
  end
end
