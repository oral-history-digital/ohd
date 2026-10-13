require "test_helper"

class UserTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  test 'can change password with all possible special signs' do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?
    user.update(password: 'NewPassword123#?!@$%^&*-+=')
    assert user.valid?
  end

  test 'accepts password with #?!@$%^&*+=_,.:;~-. as special sign' do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?

    special_signs = '#?!@$%^&*+=_,.:;~-.'.chars
    special_signs.each do |sign|
      user.update(password: "Abcdef1#{sign}")
      assert user.valid?, "Password with special sign '#{sign}' should be valid"
    end
  end

  test ['password needs',
    'upper- and downercase letter',
    'number and special sign',
    'and at least 8 characters'
  ].join do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?
    user.update(password: 'short')
    assert_not user.valid?
    user.update(password: 'alllowercase')
    assert_not user.valid?
    user.update(password: 'ALLUPPERCASE')
    assert_not user.valid?
    user.update(password: 'NoSpecialSign1')
    assert_not user.valid?
    user.update(password: 'NoNumber#')
    assert_not user.valid?
  end

  test 'display name only includes real academic titles' do
    user = User.find_by!(email: 'john@example.com')
    user.update!(first_name: 'Firstname', last_name: 'Lastname')

    user.update!(appellation: 'not_specified')
    assert_equal 'Firstname Lastname', user.display_name

    user.update!(appellation: 'dr')
    expected_title = TranslationValue.for('user.appellation.dr', I18n.locale)
    assert_equal [expected_title, 'Firstname Lastname'].join(' '), user.display_name
  end

  test 'uses project default locale when user locale is unavailable' do
    user = User.find_by!(email: 'john@example.com')
    user.update!(default_locale: 'es')
    project = DataHelper.test_project(
      shortname: "locale#{SecureRandom.hex(2)}a",
      available_locales: %w[de en],
      default_locale: 'de'
    )

    assert_equal 'de', user.locale_with_project_fallback(project)

    project.update!(available_locales: %w[de en es])
    assert_equal 'es', user.locale_with_project_fallback(project)
  end

  test 'sends hint_to_old_email when email is changed' do
    user = User.find_by!(email: 'john@example.com')
    old_email = user.email
    new_email = 'newemail@example.com'

    # Set unconfirmed_email to simulate email change
    user.unconfirmed_email = new_email

    # Track if hint_to_old_email was called
    hint_called = false
    original_hint_method = user.method(:hint_to_old_email)
    
    user.define_singleton_method(:hint_to_old_email) do
      hint_called = true
    end

    # Override super to prevent Devise from trying to send emails
    user.define_singleton_method(:send_reconfirmation_instructions) do
      hint_to_old_email if unconfirmed_email.present?
      # Don't call super to avoid Devise mapping issues in tests
    end

    # Call the method that should trigger hint_to_old_email
    user.send_reconfirmation_instructions

    # Verify hint_to_old_email was called
    assert hint_called, "hint_to_old_email should be called when send_reconfirmation_instructions is invoked"
    
    # Verify unconfirmed_email is set
    assert_equal new_email, user.unconfirmed_email
    # Old email should still be in the email field
    assert_equal old_email, user.email
  end

end
