class Add2faTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key(:login_with_passkey, {
      en: 'Login with Passkey',
      de: 'Mit Passkey anmelden',
      ru: 'Войти с помощью Passkey'
    })
    TranslationValue.create_or_update_for_key(:send_otp_per_mail, {
      en: 'Send OTP via Email',
      de: 'OTP per E-Mail senden',
      ru: 'Отправить OTP по электронной почте'
    })
    TranslationValue.create_or_update_for_key(:sent_otp_per_mail, {
      en: 'An OTP has been sent to your email address.',
      de: 'Ein OTP wurde an Ihre E-Mail-Adresse gesendet.',
      ru: 'OTP было отправлено на ваш адрес электронной почты.'
    })
    TranslationValue.create_or_update_for_key(:no_passkeys_found, {
      en: 'No passkeys found for this email.',
      de: 'Für diese E-Mail wurden keine Passkeys gefunden.',
      ru: 'Для этого адреса электронной почты не найдены пасскеи.'
    })
    TranslationValue.create_or_update_for_key(:invalid_passkey, {
      en: 'Invalid passkey. Please try again.',
      de: 'Ungültiger Passkey. Bitte versuchen Sie es erneut.',
      ru: 'Недействительный пасскей. Пожалуйста, попробуйте еще раз.'
    })
    TranslationValue.create_or_update_for_key(:email_missing, {
      en: 'Email is required to login with a passkey.',
      de: 'E-Mail ist erforderlich, um sich mit einem Passkey anzumelden.',
      ru: 'Для входа с помощью пасскея требуется адрес электронной почты.'
    })
  end

  def down
    TranslationValue.where(key: [
      'login_with_passkey',
      'send_otp_per_mail',
      'sent_otp_per_mail',
      'no_passkeys_found',
      'invalid_passkey',
      'email_missing'
    ]).destroy_all
  end
end
