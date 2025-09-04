class AddMaterialsTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'materials': {
      en: 'Additional Materials',
      de: 'Zusatzmaterialien',
      el: 'Συμπληρωματικό υλικό',
      es: 'Materiales adicionales',
      ru: 'Дополнительные материалы',
      uk: 'Додаткові матеріали',
      ar: 'مواد إضافية',
    },
    'edit.material.new': {
      en: 'New',
      de: 'Neu',
    },
    'edit.material.edit': {
      en: 'Edit',
      de: 'Bearbeiten',
    },
    'edit.material.delete': {
      en: 'Delete',
      de: 'Löschen',
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
