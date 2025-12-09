class AddCatalogLinkTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.interview_metadata.archive_link_title': {
      de: 'Archiv im OHD-Katalog',
      en: 'Archive in the OHD catalog',
      el: 'Αρχείο στον κατάλογο OHD',
      es: 'Archivo en el catálogo OHD',
      ru: 'Архив в каталоге OHD',
      uk: 'Архів у каталозі OHD',
      ar: 'الأرشيف في فهرس OHD'
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
