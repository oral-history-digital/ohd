require 'test_helper'

class RegistrationLocaleTest < ActionDispatch::IntegrationTest
  test 'confirmation email uses the locale submitted from registration UI' do
    email = "locale-check-#{SecureRandom.hex(4)}@example.com"

    assert_difference('User.count', 1) do
      post '/de/users', params: {
        user: {
          first_name: 'Lokal',
          last_name: 'Test',
          email: email,
          country: 'DE',
          street: 'Am Dornbusch 13',
          city: 'Frankfurt am Main',
          password: 'Password123!',
          password_confirmation: 'Password123!',
          tos_agreement: '1',
          priv_agreement: '1',
          default_locale: 'de',
          pre_register_location: 'http://test.portal.oral-history.localhost:47001/de/register',
        },
      }
    end

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

    confirmation_link = links_from_email(confirmation).first
    assert_includes confirmation_link, '/de/users/confirmation?'
  end
end
