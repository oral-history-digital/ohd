class AddUserTableTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'enabled': {
      de: 'aktiviert',
      en: 'enabled',
      el: 'ενεργοποιημένο',
      es: 'habilitado',
      ru: 'включено',
      uk: 'увімкнено',
      ar: 'مفعّل',
    },
    'disabled': {
      de: 'deaktiviert',
      en: 'disabled',
      el: 'απενεργοποιημένο',
      es: 'deshabilitado',
      ru: 'выключено',
      uk: 'вимкнено',
      ar: 'معطّل',
    },
    'user.mfa_otp': {
      de: 'Einmalpasswort (OTP)',
      en: 'One-Time Password (OTP)',
      el: 'Κωδικός μίας χρήσης (OTP)',
      es: 'Contraseña de un solo uso (OTP)',
      ru: 'Одноразовый пароль (OTP)',
      uk: 'Одноразовий пароль (OTP)',
      ar: 'كلمة مرور لمرة واحدة (OTP)',
    },
    'user.mfa_passkey': {
      de: 'Passkey',
      en: 'Passkey',
      el: 'Κλειδί πρόσβασης',
      es: 'Clave de acceso',
      ru: 'Ключ доступа',
      uk: 'Ключ доступу',
      ar: 'مفتاح مرور',
    },
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      tv = TranslationValue.find_or_create_by(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end
  end

  def down
    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end
