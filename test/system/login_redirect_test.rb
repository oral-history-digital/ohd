require "application_system_test_case"


class LoginRedirectTest < ApplicationSystemTestCase

  EMAIL = 'john@example.com'
  PASSWORD = 'Password123!'

  test "login from project subpage redirects back to that subpage" do
    project = DataHelper.test_project(
      shortname: 'redirproj',
      archive_domain: 'http://redirectproject.localhost:47001',
      name: 'Redirect Project',
      introduction: 'Redirect intro',
      more_text: 'Redirect more text',
      landing_page_text: 'Redirect project landing page'
    )
    DataHelper.test_registry(project)
    DataHelper.test_contribution_type(project)

    user = User.find_by(email: EMAIL)
    DataHelper.grant_access(project, user)

    visit 'http://redirectproject.localhost:47001/en/searches/archive?sort=random'
    assert_text 'Redirect Project'

    within '.SessionButtons' do
      click_test_id('login-link')
    end

    fill_in 'user[email]', with: 'john@example.com'
    fill_in 'user[password]', with: 'Password123!'
    click_on 'Login'

    # Cross-domain session handover and the project page render asynchronously.
    # Wait for project-specific content before asserting the final URL.
    assert_text 'Redirect Project', wait: 10
    redirected_url = URI.parse(current_url)
    redirected_query = Rack::Utils.parse_nested_query(redirected_url.query)

    assert_equal 'redirectproject.localhost', redirected_url.host
    assert_equal '/en/searches/archive', redirected_url.path
    assert_equal 'random', redirected_query['sort']
    assert_nil redirected_query['checked_ohd_session']
    assert_text 'Redirect Project'
  end

  test "login from project startpage works without refresh" do
    Capybara.reset_sessions!

    # First visit the portal startpage, then a project startpage.
    visit "#{OHD_DOMAIN}/de"
    startpage_url = URI.parse(current_url)
    assert_equal URI.parse(OHD_DOMAIN).host, startpage_url.host
    startpage_locale = startpage_url.path.split('/')[1]
    assert_includes %w[de en], startpage_locale

    visit "#{OHD_DOMAIN}/ohf/de"
    assert_current_path '/ohf/de', ignore_query: true

    visit "#{OHD_DOMAIN}/#{startpage_locale}/users/sign_in?path=/ohf/de&project=ohf"
    assert_current_path "/#{startpage_locale}/users/sign_in", ignore_query: true

    fill_in 'user[email]', with: 'alice@example.com'
    password_field = find_field('user[password]')
    password_field.set('Password123!')
    password_field.send_keys(:enter)

    assert_equal '/ohf/de', current_path
  end

  test "guest visiting a non-default locale on a custom domain returns to that domain" do
    # The default test project shares the portal domain. Production does not,
    # because Project.archive_domains deliberately excludes the OHD project.
    # Remove the fixture collision so this follows production routing.
    Project.find_by!(shortname: 'test').update!(archive_domain: nil)

    project = DataHelper.test_project(
      shortname: 'za',
      archive_domain: 'http://za.localhost:47001',
      available_locales: %w[en ru],
      default_locale: 'en',
      name: 'ZA Project'
    )

    Capybara.reset_sessions!
    visit "#{project.archive_domain}/ru"

    assert_text 'ZA Project', wait: 10

    redirected_url = URI.parse(current_url)
    assert_equal 'za.localhost', redirected_url.host
    assert_equal '/ru', redirected_url.path
    assert_equal 'true', Rack::Utils.parse_nested_query(redirected_url.query)['checked_ohd_session']
  end

  test "login with TOTP from project subpage keeps redirect context on quick click" do
    project = setup_redirect_project_for_user(email: EMAIL)
    user = User.find_by(email: EMAIL)

    user.update!(
      otp_secret: User.generate_otp_secret,
      otp_required_for_login: true,
      passkey_required_for_login: false
    )

    visit "#{project.archive_domain}/en/searches/archive?sort=random"
    assert_text 'Redirect Project'

    within '.SessionButtons' do
      click_test_id('login-link')
    end

    fill_in 'user[email]', with: EMAIL
    fill_in 'user[password]', with: PASSWORD
    click_on 'Login'

    assert_current_path users_otp_path(locale: I18n.locale), ignore_query: true

    # Verify redirect context is present on OTP form before submitting.
    assert_selector "input[name='path'][value='/en/searches/archive?sort=random']", visible: false
    assert_selector "input[name='project'][value='redirproj']", visible: false

    user.current_otp.chars.each_with_index do |digit, index|
      input = find("input.otp-digit[data-index='#{index}']")
      input.click
      input.send_keys(digit)
    end

    # Reproduce user behavior: click quickly after entering the last digit.
    click_on 'Login'

    assert_redirected_to_project_subpage
  end

end
