class AddExplorerTabTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.tab.archives_and_collections': {
      de: 'Archive & Sammlungen',
      en: 'Archives & Collections',
      el: 'Αρχεία & Συλλογές',
      es: 'Archivos y Colecciones',
      ru: 'Архивы и коллекции',
      uk: 'Архіви та колекції',
      ar: 'الأرشيفات والمجموعات',
    },
    'explorer.tab.institutions': {
      de: 'Institutionen',
      en: 'Institutions',
      el: 'Ιδρύματα',
      es: 'Instituciones',
      ru: 'Учреждения',
      uk: 'Установи',
      ar: 'المؤسسات',
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
