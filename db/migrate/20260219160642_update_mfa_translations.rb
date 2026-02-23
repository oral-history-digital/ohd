class UpdateMfaTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('user.mfa_login_info', {
      de: 'Mit einer Multifaktor-Authentifizierung (MFA) können Sie Ihr Konto - zusätzlich zu Ihrem Passwort - vor unbefugtem Zugriff schützen. Nutzen Sie dafür eine der beiden folgenden Methoden:',
      en: 'In addition to your password, you can use multi-factor authentication (MFA) to protect your account from unauthorised access. You can do this using one of the following two methods:',
      ru: 'Помимо пароля, вы можете использовать многофакторную аутентификацию (MFA), чтобы защитить свою учетную запись от несанкционированного доступа. Вы можете сделать это с помощью одного из следующих двух методов:'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.otp_required_for_login", {
      de: 'Authentifizierungs-App aktivieren/deaktivieren (optional).',
      en: 'Enable/disable authentication app (optional).',
      ru: 'Включить/отключить приложение-аутентификатор (необязательно).'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.passkey_required_for_login", {
      de: 'Passkey auf Ihrem Gerät aktivieren/deaktivieren (optional).',
      en: 'Enable/disable passkey on your device (optional).',
      ru: 'Включить/отключить пасскей на вашем устройстве (необязательно).'
    })
    TranslationValue.create_or_update_for_key("after_enable_2fa.title", {
      de: "MFA QR Code", 
      en: "MFA QR Code",
      ru: "MFA QR код"
    })
    TranslationValue.create_or_update_for_key("after_enable_2fa.text", {
      de: "Scannen Sie diesen QR Code mit Ihrer Authentifizierungs-App (2FAS, Authy, Google Authenticator, ...).",
      en: "Scan this QR code with your authentication app (2FAS, Authy, Google Authenticator, ...).",
      ru: "Отсканируйте этот QR код с помощью вашего приложения-аутентификатора (2FAS, Authy, Google Authenticator, ...)."
    })
    TranslationValue.create_or_update_for_key(:no_passkeys_found, {
      en: 'No passkey was found for this email address. Once you have logged in, you can set up multi-factor authentication in your account.',
      de: 'Für diese E-Mail wurde kein Passkey gefunden. Nach Anmeldung können Sie in Ihrem Konto eine Multifaktor-Authentifizierung einrichten.',
      ru: 'Для этого адреса электронной почты не найдено пасскея. После входа в систему вы можете настроить многофакторную аутентификацию в своей учетной записи.'
    })
    TranslationValue.create_or_update_for_key("activerecord.attributes.user.otp_attempt", {
      en: "One-time Code",
      de: "Einmal-Code",
      ru: "Одноразовый код"
    })
    TranslationValue.create_or_update_for_key(:send_otp_per_mail, {
      en: 'Send one-time code by email.',
      de: 'Einmal-Code per E-Mail senden',
      ru: 'Отправить одноразовый код по электронной почте'
    })
    TranslationValue.create_or_update_for_key(:sent_otp_per_mail, {
      en: 'An one-time code has been sent to your email address.',
      de: 'Ein Einmal-Code wurde an Ihre E-Mail-Adresse gesendet.',
      ru: 'Одноразовый код было отправлено на ваш адрес электронной почты.'
    })
    TranslationValue.create_or_update_for_key('devise.failure.invalid_otp', {
      de: 'Sie haben einen fehlerhaften oder abgelaufenen Einmal-Code eingegeben. Bitte kehren Sie zum Anmeldefenster zurück und geben Sie einen aktuellen 6-stelligen Code ein.',
      en: 'You have entered an incorrect or expired one-time code. Please go back to the login screen and enter a valid 6-digit code.',
      ru: 'Вы ввели неправильный или истекший одноразовый код. Пожалуйста, вернитесь на экран входа и введите действующий 6-значный код.'
    })
  end

  def down
    TranslationValue.where(key: 'user.mfa_login_info').destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.otp_required_for_login").destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.passkey_required_for_login").destroy_all
    TranslationValue.where(key: "after_enable_2fa.title").destroy_all
    TranslationValue.where(key: "after_enable_2fa.text").destroy_all
    TranslationValue.where(key: :no_passkeys_found).destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.otp_attempt").destroy_all
    TranslationValue.where(key: :send_otp_per_mail).destroy_all
    TranslationValue.where(key: :sent_otp_per_mail).destroy_all
    TranslationValue.where(key: 'devise.failure.invalid_otp').destroy_all
  end
end
