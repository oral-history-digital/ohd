class AddCatalogBreadcrumbTitleTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.catalog.breadcrumb_title': {
      de: 'Archive und Sammlungen',
      en: 'Archives and Collections',
      el: 'Αρχεία και Συλλογές',
      es: 'Archivos y Colecciones',
      ru: 'Архивы и Коллекции',
      uk: 'Архіви і Колекції',
      ar: 'الأرشيفات والمجموعات',
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
