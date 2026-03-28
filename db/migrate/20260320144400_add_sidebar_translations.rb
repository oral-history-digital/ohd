class AddSidebarTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.sidebar.catalog': {
      de: 'Archive & Sammlungen',
      en: 'Archives & Collections',
      el: 'Αρχεία & Συλλογές',
      es: 'Archivos & Colecciones',
      ru: 'Архивы & Коллекции',
      uk: 'Архіви & Колекції',
      ar: 'الأرشيفات والمجموعات',
    },
    'modules.sidebar.search': {
      de: 'Interviews',
      en: 'Interviews',
      el: 'Συνεντεύξεις',
      es: 'Entrevistas',
      ru: 'Интервью',
      uk: 'Інтерв\'ю',
      ar: 'المقابلات',
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
