class AddThumbnailBadgeTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'show_segment_hits': {
      en: 'Show search results',
      de: 'Suchergebnisse einblenden',
      el: 'Εμφάνιση αποτελεσμάτων αναζήτησης',
      es: 'Mostrar resultados de búsqueda',
      ru: 'Показать результаты поиска',
      uk: 'Показати результати пошуку',
      ar: 'عرض نتائج البحث',
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
