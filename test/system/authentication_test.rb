require "application_system_test_case"

class RegistrationTest < ApplicationSystemTestCase

  EMAIL = 'john@example.com'
  PASSWORD = 'Password123!'

  test "register as a new user without MFA" do
    fill_registration_form(
      first_name: 'Mario',
      last_name: 'Rossi',
      email: 'mrossi@example.com'
    )
    confirm_registration_email

    # step 2
    within("[data-testid='user_project-form-wrapper']") do
      find_test_id('user_project-organization-text-input').set('Goethe University')
      select_test_id_option('user_project-job_description-select', 'Researcher')
      select_test_id_option('user_project-research_intentions-select', 'Education')
      find_test_id('user_project-specification-textarea').set('project ...')
      click_test_id('user_project-tos_agreement-checkbox-input')
      click_on 'Submit activation request'
    end
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
    #Capybara.reset_sessions!
    click_on 'Logout'

    # enjoy ...
    login_as 'mrossi@example.com'
    assert_text 'The test archive'
  end

  test "register confirmation returns to originating page and shows access step two" do
    email = 'flow-check@example.com'

    visit '/en/searches/archive?sort=random&checked_ohd_session=true'
    within '.SessionButtons' do
      click_test_id('register-link')
    end

    fill_in 'First Name', with: 'Flow'
    fill_in 'Last Name', with: 'Check'
    select 'Germany'
    fill_in 'Street', with: 'Am Dornbusch 13'
    fill_in 'City', with: 'Frankfurt am Main'
    fill_in 'Email', with: email
    fill_in 'Password', name: 'password', with: 'Password123!'
    fill_in 'Password confirmation', with: 'Password123!'
    check 'Terms of Use', visible: :all
    check 'Privacy Policy', visible: :all
    click_on 'Submit registration'

    assert_text 'Your registration has been successfully submitted!'

    user = User.find_by(email: email)
    assert_not_nil user
    assert_equal 'http://test.portal.oral-history.localhost:47001/en/searches/archive?sort=random', user.pre_register_location

    confirm_registration_email

    current_query = Rack::Utils.parse_nested_query(URI.parse(current_url).query)
    assert_equal '/en/searches/archive', current_path
    assert_equal 'random', current_query['sort']
    assert_nil current_query['checked_ohd_session']
    expected_path = current_path
    assert_selector("[data-testid='user_project-form-wrapper']")

    within("[data-testid='user_project-form-wrapper']") do
      find_test_id('user_project-organization-text-input').set('Goethe University')
      select_test_id_option('user_project-job_description-select', 'Researcher')
      select_test_id_option('user_project-research_intentions-select', 'Education')
      find_test_id('user_project-specification-textarea').set('project ...')
      click_test_id('user_project-tos_agreement-checkbox-input')
      click_on 'Submit activation request'
    end

    assert_text 'Your activation request has been successfully submitted'
    assert_equal expected_path, current_path
    click_on 'OK'
    assert_equal expected_path, current_path

    mails = ActionMailer::Base.deliveries
    assert_equal 2, mails.count
    assert_match /request for review/, mails.last.subject
  end

  test "registration confirmation email uses UI locale" do
    email = "locale-check-#{SecureRandom.hex(4)}@example.com"

    fill_registration_form(
      first_name: 'Mario',
      last_name: 'Rossi',
      email: email,
      locale: 'de'
    )

    user = User.find_by(email: email)
    assert_not_nil user
    assert_equal 'de', user.default_locale

    mails = ActionMailer::Base.deliveries
    assert_equal 1, mails.count

    confirmation = mails.last
    expected_subject = TranslationValue.for(
      'devise.mailer.confirmation_instructions.subject',
      'de'
    )
    assert_equal expected_subject, confirmation.subject

    link = links_from_email(confirmation)[0]
    assert_match %r{/de/users/confirmation\?confirmation_token=}, link
  end

  #test "user can enable TOTP during registration" do
    #email = 'achim@example.com'
    #fill_registration_form(
      #first_name: 'Achim',
      #last_name: 'Rossi',
      #email: email,
      #otp_required: true
    #)
    #confirm_registration_email

    #user = User.find_by(email: email)
    #assert_not_nil user
    #assert user.otp_required_for_login
  #end

  test "user sees QR code and secret when enabling TOTP" do
    visit '/'
    login_as EMAIL

    click_on 'Account'
    click_on 'Edit'
    
    check "user_otp_required_for_login", visible: :all
    click_on 'Submit'
    
    assert_text 'Scan this QR code'
  end

  test "user can login with TOTP code from authenticator app" do
    user = User.find_by(email: EMAIL)
    user.otp_secret = User.generate_otp_secret
    user.otp_required_for_login = true
    user.save!
    
    login_as EMAIL, PASSWORD
    
    # Should be redirected to 2FA page
    assert_current_path users_otp_path(locale: I18n.locale), ignore_query: true
    assert_text 'One-time code'
    
    # Generate valid TOTP code
    totp_code = user.current_otp
    
    totp_code.chars.each_with_index do |digit, index|
      find("input.otp-digit[data-index='#{index}']").set(digit)
    end

    # Form should auto-submit after 6 digits
    sleep 0.3
    
    assert_text 'Logout'
  end

  #test "stimulus controller handles paste of 6-digit code" do
    #user = User.find_by(email: EMAIL)
    #user.otp_secret = User.generate_otp_secret
    #user.otp_required_for_login = true
    #user.save!
    
    #login_as EMAIL, PASSWORD
    
    #totp_code = user.current_otp
    
    ## Paste entire code into first field
    #first_digit_field = find('input[data-index="0"]')
    #first_digit_field.send_keys(totp_code)

    #page.execute_script("
      #const input = document.querySelector('input.otp-digit[data-index=\"0\"]');
      #const event = new ClipboardEvent('paste', {
        #clipboardData: new DataTransfer()
      #});
      #event.clipboardData.setData('text/plain', '#{totp_code}');
      #input.dispatchEvent(event);
    #")

    
    #sleep 0.3
    
    #assert_text 'Logout'
  #end

  #test "stimulus controller allows backspace navigation" do
    #user = User.find_by(email: EMAIL)
    #user.otp_secret = User.generate_otp_secret
    #user.otp_required_for_login = true
    #user.save! 
    
    #login_as EMAIL, PASSWORD
    
    #find("input.otp-digit[data-index='0']").set('1')
    #find("input.otp-digit[data-index='1']").set('2')
    #find("input.otp-digit[data-index='2']").set('3')
    
    ## Press backspace in third field
    #third_field = find("input.otp-digit[data-index='2']")
    #third_field.send_keys(:backspace)
    
    ## Should focus second field and clear it
    #second_field = find("input.otp-digit[data-index='1']")
    #assert_equal '', second_field.value
  #end

  test "stimulus controller only accepts numbers" do
    user = User.find_by(email: EMAIL)
    user.otp_secret = User.generate_otp_secret
    user.otp_required_for_login = true
    user.save! 
    
    login_as EMAIL, PASSWORD
    
    first_input = find("input.otp-digit[data-index='0']")
    first_input.set('abc')
    
    assert_equal '', first_input.value
  end

  #test "user can request email OTP as backup" do
    #user = User.find_by(email: EMAIL)
    #user.otp_secret = User.generate_otp_secret
    #user.otp_required_for_login = true
    #user.save! 
    
    #login_as EMAIL, PASSWORD
    #click_on 'Send OTP via Email'

    #email = ActionMailer::Base.deliveries.last
    #assert_equal [user.email], email.to
    #assert_match /authentication|code/i, email.subject
    
    #email_code = email.body.to_s.match(/\b\d{6}\b/).to_s
    
    #email_code.chars.each_with_index do |digit, index|
      #find("input.otp-digit[data-index='#{index}']").set(digit)
    #end
    
    #sleep 0.3
    
    #assert_text 'Logout'
  #end

  #test "invalid TOTP code shows error" do
    #user = User.find_by(email: EMAIL)
    #user.otp_secret = User.generate_otp_secret
    #user.otp_required_for_login = true
    #user.save!
    
    #login_as EMAIL, PASSWORD
    
    #'000000'.chars.each_with_index do |digit, index|
      #find("input.otp-digit[data-index='#{index}']").set(digit)
    #end
    
    #sleep 0.3
    
    #assert_text 'Invalid authentication code'
    #assert_current_path users_otp_path(locale: I18n.locale)
  #end

  #test "user can disable TOTP from settings" do
    #user = User.find_by(email: EMAIL)
    #user.otp_secret = User.generate_otp_secret
    #user.otp_required_for_login = true
    #user.save!
    
    #login_as EMAIL, PASSWORD
    
    #totp_code = user.current_otp
    #totp_code.chars.each_with_index do |digit, index|
      #find("input.otp-digit[data-index='#{index}']").set(digit)
    #end
    
    #sleep 0.3
    
    #click_on 'Account'
    #click_on 'Edit'
    
    #uncheck "user_otp_required_for_login", visible: :all
    #click_on 'Submit'
    
    #user.reload
    #assert_not user.otp_required_for_login
  #end

  # locakable tests:
  test "user account is locked after too many failed login attempts" do
    user = User.find_by(email: EMAIL)
    assert_not_nil user

    # ensure clean state
    user.update!(
      failed_attempts: 0,
      locked_at: nil
    )

    visit '/'
    click_on 'Login'

    # fail login configured times
    Devise.maximum_attempts.times do
      assert_current_path '/en/users/sign_in', ignore_query: true
      assert_selector 'form.Form.default'

      within('form.Form.default') do
        fill_in 'user[email]', with: EMAIL
        fill_in 'user[password]', with: 'WrongPassword8!'
        click_on 'Login'
      end

      assert_current_path '/en/users/sign_in', ignore_query: true
      assert_selector 'form.Form.default'
      assert_selector '.notification-container', text: /Invalid credentials|You have one more attempt before|Too many failed login attempts|For security reasons/
    end

    user.reload
    assert user.access_locked?

    # now try with the correct password
    assert_current_path '/en/users/sign_in', ignore_query: true
    assert_selector 'form.Form.default'

    within('form.Form.default') do
      fill_in 'user[email]', with: EMAIL
      fill_in 'user[password]', with: PASSWORD
      click_on 'Login'
    end

    assert_text "For security reasons, your account is locked after multiple failed attempts."
  end

  test "locked user can login after lock expires" do
    user = User.find_by(email: EMAIL)

    user.update!(
      failed_attempts: Devise.maximum_attempts,
      locked_at: (Devise.unlock_in + 1.minute).ago
    )

    visit '/'
    click_on 'Login'

    fill_in 'user[email]', with: EMAIL
    fill_in 'user[password]', with: PASSWORD
    click_on 'Login'

    assert_text 'The test archive'
  end
end
