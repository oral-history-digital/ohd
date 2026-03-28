class AddHomepageTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.site_startpage.previous': {
      de: 'Zurück',
      en: 'Previous',
      el: 'Προηγούμενο',
      es: 'Anterior',
      ru: 'Предыдущий',
      uk: 'Попередній',
      ar: 'السابق',
    },
    'modules.site_startpage.next': {
      de: 'Weiter',
      en: 'Next',
      el: 'Επόμενο',
      es: 'Siguiente',
      ru: 'Следующий',
      uk: 'Наступний',
      ar: 'التالي',
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
