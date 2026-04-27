class AddResetFiltersTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'reset_filters': {
      de: 'Filter zurücksetzen',
      en: 'Reset filters',
      el: 'Επαναφορά φίλτρων',
      es: 'Restablecer filtros',
      ru: 'Сбросить фильтры',
      uk: 'Скинути фільтри',
      ar: 'إعادة تعيين الفلاتر',
    },
  }.freeze

  KEYS_TO_REMOVE = [
    'explorer.reset_all_filters',
  ].freeze

    REMOVED_TRANSLATIONS = {
      'explorer.reset_all_filters': {
        de: 'Alle Filter zurücksetzen',
        en: 'Reset all filters',
        el: 'Επαναφορά όλων των φίλτρων',
        es: 'Restablecer todos los filtros',
        ru: 'Сбросить все фильтры',
        uk: 'Скинути всі фільтри',
        ar: 'إعادة تعيين جميع المرشحات',
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

    remove_translations(KEYS_TO_REMOVE)
  end

  def down
    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end

    restore_translations(REMOVED_TRANSLATIONS)
  end

    def remove_translations(keys)
    TranslationValue.where(key: keys).destroy_all
  end

  def restore_translations(translations_by_key)
    translations_by_key.each do |key, translations|
      tv = TranslationValue.find_or_create_by!(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update!(value: value)
      end
    end
  end
end

