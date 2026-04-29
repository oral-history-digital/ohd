class AddProjectHomeTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.project_home.sample_interviews': {
        de: 'Beispielinterviews',
        en: 'Sample Interviews',
        el: 'Δείγματα Συνεντεύξεων',
        es: 'Entrevistas de muestra',
        ru: 'Примеры интервью',
        uk: 'Приклади інтерв\'ю',
        ar: 'نماذج المقابلات',
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
