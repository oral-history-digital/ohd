class AddCatalogBreadcrumbTitleTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.catalog.breadcrumb_title': {
      de: 'Archive & Sammlungen',
      en: 'Archives & Collections',
      el: 'Αρχεία & Συλλογές',
      es: 'Archivos & Colecciones',
      ru: 'Архивы & Коллекции',
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
