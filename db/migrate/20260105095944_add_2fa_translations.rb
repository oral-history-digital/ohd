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
    TranslationValue.create_or_update_for_key(:passkey_deleted, {
      en: "Passkey deleted. Note: You'll also need to manually delete it from your device's password manager (iCloud Keychain, Google Password Manager, etc.).",
      de: "Passkey gelöscht. Hinweis: Sie müssen es auch manuell aus dem Passwort-Manager Ihres Geräts (iCloud Schlüsselbund, Google Passwort-Manager usw.) löschen.",
      ru: "Пасскей удален. Примечание: вам также необходимо вручную удалить его из менеджера паролей вашего устройства (iCloud Keychain, Google Password Manager и т.д.)."
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
