class AddGenericRegistrationErrorTranslationValue < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.registration.messages.generic_registration_error': {
      de: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      en: 'Registration failed. Please try again.',
      el: 'Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.',
      es: 'No se pudo completar el registro. Por favor, inténtelo de nuevo.',
      ru: 'Не удалось завершить регистрацию. Пожалуйста, попробуйте еще раз.',
      uk: 'Не вдалося завершити реєстрацію. Будь ласка, спробуйте ще раз.',
      ar: 'فشلت عملية التسجيل. يُرجى المحاولة مرة أخرى.',
    },
  }

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
