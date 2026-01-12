require "application_system_test_case"

class RegistrationTest < ApplicationSystemTestCase

  PASSWORD = 'Password123!'

  test "register as a new user without MFA" do
    fill_registration_form(
      first_name: 'Mario',
      last_name: 'Rossi',
      email: 'mrossi@example.com'
    )
    confirm_registration_email

    # step 2 - 
    fill_in 'Institution', with: 'Goethe University'
    select 'Researcher'
    select 'Education'
    fill_in 'specification', with: 'project ...'
    check 'Terms of Use', visible: :all
    click_on 'Submit activation request'
    assert_text 'Your activation request has been successfully submitted'
    click_on 'OK'
    click_on 'Logout'

    # step 3 - activate user as admin
    login_as 'alice@example.com'
    mails = ActionMailer::Base.deliveries
    assert_equal 2, mails.count
    request = mails.last
    assert_match /request for review/, request.subject
    link = links_from_email(request)[0]
    visit link
    click_on 'Editing interface'
    click_on 'Edit item'
    select 'Activate'
    assert_text '<p>Hello Mario Rossi,</p><p>You now have access to the application'
    click_on 'Submit'
    click_on 'Account'
    Capybara.reset_sessions!

    # enjoy ...
    visit '/'
    login_as 'mrossi@example.com'
    assert_text 'The test archive'
  end

  test "register as a new user with Webauthn checked" do
  end

  test "register as a new user with Webauthn MFA" do
    email = 'hallo@du.de'

    fill_registration_form(
      first_name: 'Mario',
      last_name: 'Rossi',
      email: email,
      passkey_required: true
    )
    confirm_registration_email

    user = User.find_by(email: email)
    assert_not_nil user
    assert user.passkey_required_for_login
    assert user.changed_to_passkey_at + 10.minutes > Time.current
    assert_text 'Register passkey'
    fill_in 'Name', with: 'My Security Key'
    click_on 'Register Passkey'
    assert_text 'Passkey successfully registered'
    assert user.webauthn_credentials.count == 1
  end

  def fill_registration_form(first_name:, last_name:, email:, passkey_required: false, otp_required: false)
    visit '/'
    click_on 'Registration'
    fill_in 'First Name', with: first_name
    fill_in 'Last Name', with: last_name
    select 'Germany'
    fill_in 'Street', with: 'Am Dornbusch 13'
    fill_in 'City', with: 'Frankfurt am Main'
    fill_in 'Email', with: email
    fill_in 'Password', name: 'password', with: PASSWORD
    fill_in 'Password confirmation', with: PASSWORD
    check "user_passkey_required_for_login", visible: :all if passkey_required
    check "user_otp_required_for_login", visible: :all if otp_required
    check 'Terms of Use', visible: :all
    check 'Privacy Policy', visible: :all
    click_on 'Submit registration'
    binding.pry
    assert_text 'Your registration has been successfully submitted!'
  end

  def confirm_registration_email
    mails = ActionMailer::Base.deliveries
    assert_equal 1, mails.count
    confirmation = mails.last
    assert_match /Confirmation of your registration/, confirmation.subject
    link = links_from_email(confirmation)[0]
    visit link
  end

end
