require 'application_system_test_case'

# Verifies that resetting a browser clears state across project domains.
class BrowserSessionResetTest < ApplicationSystemTestCase
  test 'reset clears cookies and storage on previously visited domains' do
    Project.find_by!(shortname: 'test').update!(archive_domain: nil)
    project = DataHelper.test_project(
      shortname: 'resetproject',
      archive_domain: 'http://resetproject.localhost:47001',
      name: 'Reset Project'
    )
    urls = ["#{OHD_DOMAIN}/en?checked_ohd_session=true",
            "#{project.archive_domain}/en?checked_ohd_session=true"]

    urls.each do |url|
      visit url
      assert_equal URI.parse(url).host, URI.parse(current_url).host
      page.execute_script(<<~JS)
        document.cookie = 'reset_test=value; path=/';
        localStorage.setItem('reset_test', 'value');
        sessionStorage.setItem('reset_test', 'value');
      JS
      assert_equal 'value', page.evaluate_script("localStorage.getItem('reset_test')")
      assert_equal 'value', page.evaluate_script("sessionStorage.getItem('reset_test')")
      assert_match(/(?:^|; )reset_test=value(?:;|$)/, page.evaluate_script('document.cookie'))
    end

    if Gem.loaded_specs.fetch('capybara').version == Gem::Version.new('3.40.0')
      driver = page.driver
      browser = driver.browser
      driver.stub(:chromedriver_version, 158) { Capybara.reset_sessions! }
      assert_not_same browser, driver.browser
    else
      Capybara.reset_sessions!
    end

    urls.each do |url|
      visit url
      assert_equal URI.parse(url).host, URI.parse(current_url).host
      assert_nil page.evaluate_script("localStorage.getItem('reset_test')")
      assert_nil page.evaluate_script("sessionStorage.getItem('reset_test')")
      assert_no_match(/(?:^|; )reset_test=/, page.evaluate_script('document.cookie'))
    end
  end
end
