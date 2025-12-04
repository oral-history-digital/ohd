class AddPasswordHelpTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'activerecord.errors.default.password_input': {
      de: 'Mindestens 8 Zeichen mit mindestens einem Großbuchstaben, einem Kleinbuchstaben, einer Zahl und einem Sonderzeichen.',
      en: 'At least 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.',
      el: 'Τουλάχιστον 8 χαρακτήρες με τουλάχιστον ένα κεφαλαίο γράμμα, ένα πεζό γράμμα, έναν αριθμό και έναν ειδικό χαρακτήρα.',
      es: 'Al menos 8 caracteres con al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
      ru: 'Не менее 8 символов, включая как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.',
      uk: 'Щонайменше 8 символів, що містять принаймні одну велику літеру, одну малу літеру, одну цифру та один спеціальний символ.',
      ar: '8 أحرف على الأقل مع حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد.',
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
