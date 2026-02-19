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
  end

  def down
    TranslationValue.where(key: 'user.mfa_login_info').destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.otp_required_for_login").destroy_all
    TranslationValue.where(key: "activerecord.attributes.user.passkey_required_for_login").destroy_all
  end
end
