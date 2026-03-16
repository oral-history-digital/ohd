class AddMissingExplorerViewCollectionPageTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    de: 'Sammlungsseite öffnen',
    en: 'View collection page',
    el: 'Προβολή σελίδας συλλογής',
    es: 'Ver página de la colección',
    ru: 'Открыть страницу коллекции',
    uk: 'Відкрити сторінку колекції',
    ar: 'عرض صفحة المجموعة',
  }.freeze

  KEY = 'explorer.view_collection_page'.freeze

  def up
    tv = TranslationValue.find_or_create_by(key: KEY)

    TRANSLATIONS.each do |locale, value|
      translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
      translation.update(value: value)
    end
  end

  def down
    TranslationValue.where(key: KEY).destroy_all
  end
end
