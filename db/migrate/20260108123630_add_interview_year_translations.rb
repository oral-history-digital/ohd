class AddInterviewYearTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'interview_year': {
      de: 'Jahr des Interviews',
      en: 'Interview Year',
      el: 'Έτος συνέντευξης',
      es: 'Año de la entrevista',
      ru: 'Год интервью',
      uk: 'Рік інтерв’ю',
      ar: 'سنة المقابلة',
    },
    'metadata_labels.interview_year': {
      de: 'Jahr des Interviews',
      en: 'Interview Year',
      el: 'Έτος συνέντευξης',
      es: 'Año de la entrevista',
      ru: 'Год интервью',
      uk: 'Рік інтерв’ю',
      ar: 'سنة المقابلة',
    },
    'search_facets.interview_year': {
      de: 'Jahr des Interviews',
      en: 'Interview Year',
      el: 'Έτος συνέντευξης',
      es: 'Año de la entrevista',
      ru: 'Год интервью',
      uk: 'Рік інтерв’ю',
      ar: 'سنة المقابلة',
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
