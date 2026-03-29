require "application_system_test_case"
require "webauthn_system_test_case"


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
    assert_current_path '/de', ignore_query: true

    visit "#{OHD_DOMAIN}/ohf/de"
    assert_current_path '/ohf/de', ignore_query: true

    visit "#{OHD_DOMAIN}/de/users/sign_in?path=/ohf/de&project=ohf"
    assert_current_path '/de/users/sign_in', ignore_query: true

    fill_in 'user[email]', with: 'alice@example.com'
    password_field = find_field('user[password]')
    password_field.set('Password123!')
    password_field.send_keys(:enter)

    assert_equal '/ohf/de', current_path
  end

  test "login with TOTP from project subpage redirects back to that subpage" do
    project = setup_redirect_project_for_user
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
    assert_text 'One-time code'

    user.current_otp.chars.each_with_index do |digit, index|
      find("input.otp-digit[data-index='#{index}']").set(digit)
    end

    sleep 0.3

    assert_redirected_to_project_subpage
  end

  private

  def setup_redirect_project_for_user
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

    project
  end

  def assert_redirected_to_project_subpage
    redirected_url = URI.parse(current_url)
    redirected_query = Rack::Utils.parse_nested_query(redirected_url.query)

    assert_equal 'redirectproject.localhost', redirected_url.host
    assert_equal '/en/searches/archive', redirected_url.path
    assert_equal 'random', redirected_query['sort']
    assert_nil redirected_query['checked_ohd_session']
    assert_text 'Redirect Project'
  end

end

class PasskeyLoginRedirectTest < WebauthnSystemTestCase

  EMAIL = 'john@example.com'

  test "login with passkey from project subpage redirects back to that subpage" do
    project = setup_redirect_project_for_user
    user = User.find_by(email: EMAIL)

    user.update!(
      otp_required_for_login: false,
      passkey_required_for_login: false
    )
    user.webauthn_credentials.destroy_all

    visit '/'
    login_as EMAIL

    click_on 'Account'
    click_on 'Edit'
    check 'user_passkey_required_for_login', visible: :all
    click_on 'Submit'
    sleep 0.5

    register_passkey
    user.reload
    assert_equal 1, user.webauthn_credentials.count

    click_on 'Logout'

    visit "#{project.archive_domain}/en/searches/archive?sort=random"
    assert_text 'Redirect Project'

    within '.SessionButtons' do
      click_test_id('login-link')
    end

    fill_in 'user[email]', with: EMAIL
    click_on 'Login with Passkey'

    sleep 0.5

    assert_redirected_to_project_subpage
  end

  private

  def setup_redirect_project_for_user
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

    project
  end

  def assert_redirected_to_project_subpage
    redirected_url = URI.parse(current_url)
    redirected_query = Rack::Utils.parse_nested_query(redirected_url.query)

    assert_equal 'redirectproject.localhost', redirected_url.host
    assert_equal '/en/searches/archive', redirected_url.path
    assert_equal 'random', redirected_query['sort']
    assert_nil redirected_query['checked_ohd_session']
    assert_text 'Redirect Project'
  end

end
