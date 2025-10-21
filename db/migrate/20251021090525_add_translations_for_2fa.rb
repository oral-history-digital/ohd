class AddTranslationsFor2fa < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create(
      key: 'otp_attempt',
      translations_attributes: [
        { value: 'Authentifizierungscode', locale: :de },
        { value: 'Authentication code', locale: :en },
      ]
    )
    TranslationValue.create(
      key: 'user.otp_required_for_login',
      translations_attributes: [
        { value: 'Einmal-Passwort erforderlich (2FA)', locale: :de },
        { value: 'Require one time password (2FA)', locale: :en },
      ]
    )
    TranslationValue.create(
      key: 'after_enable_2fa.title',
      translations_attributes: [
        { value: '2FA QR code', locale: :de },
        { value: '2FA QR code', locale: :en }
      ]
    )
    TranslationValue.create(
      key: 'after_enable_2fa.text',
      translations_attributes: [
        { value: 'Scannen Sie diesen QR code mit Ihrem Authentifizierungsclienten (Authy, Google Authenticator, ...)', locale: :de },
        { value: 'Scan this QR code with your authentication client (Authy, Google Authenticator, ...)', locale: :en }
      ]
    )
  end

  def down
  end
end
