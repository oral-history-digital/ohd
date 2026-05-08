class AddTwoFactorAuthenticationCodeSubjectTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'devise.mailer.two_factor_authentication_code.subject': {
      de: 'Einmal-Code für Multi-Faktor-Authentifizierung',
      en: 'One-time code for multi-factor authentication',
      el: 'Κωδικός μίας χρήσης για έλεγχο ταυτότητας πολλαπλών παραγόντων',
      es: 'Código de un solo uso para la autenticación multifactorial',
      ru: 'Одноразовый код для многофакторной аутентификации',
      uk: 'Одноразовий код для багатофакторної автентифікації',
      ar: 'رمز لمرة واحدة للمصادقة متعددة العوامل',
    }
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
