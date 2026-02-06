require "webauthn_system_test_case"

class WebauthnTest < WebauthnSystemTestCase

  EMAIL = 'john@example.com'
  PASSWORD = 'Password123!'

  test "register as a new user with Webauthn MFA" do
    add_virtual_authenticator
    email = 'hubert@example.com'
    fill_registration_form(
      first_name: 'Hubert',
      last_name: 'Rossi',
      email: email,
      passkey_required: true
    )
    confirm_registration_email

    user = User.find_by(email: email)
    assert_not_nil user
    assert user.passkey_required_for_login
    assert user.changed_to_passkey_at + 10.minutes > Time.current
    register_passkey
    assert user.webauthn_credentials.count == 1
  end

  test "passkey registration and login for a registered user" do
    add_virtual_authenticator
    user = User.find_by(email: EMAIL)
    user.webauthn_credentials.destroy_all

    visit '/'
    login_as EMAIL

    click_on 'Account'
    click_on 'Edit'
    check "user_passkey_required_for_login", visible: :all
    click_on 'Submit'
    sleep 0.5

    register_passkey

    assert user.webauthn_credentials.count == 1

    click_on 'Logout'

    click_on 'Login'
    fill_in 'user[email]', with: EMAIL
    click_on 'Login with Passkey'

    sleep 0.5
    assert_text 'Logout'
    assert_text 'Account'
  end

end
