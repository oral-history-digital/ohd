class AddButtonDescriptionsToHomepageBlockTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.instance.block.button_primary_description': {
        de: 'Beschreibung für Primäraktion',
        en: 'Description for primary action',
        el: 'Περιγραφή για την κύρια ενέργεια',
        es: 'Descripción de la acción principal',
        ru: 'Описание для основной кнопки',
        uk: 'Опис для основної дії',
        ar: 'الوصف للإجراء الأساسي',
    },
    'edit.instance.block.button_secondary_description': {
        de: 'Beschreibung für Sekundäraktion',
        en: 'Description for secondary action',
        el: 'Περιγραφή για τη δευτερεύουσα ενέργεια',
        es: 'Descripción de la acción secundaria',
        ru: 'Описание для вторичной кнопки',
        uk: 'Опис для додаткової дії',
        ar: 'الوصف للإجراء الثانوي',
    },
  }.freeze

  def up
    add_column :homepage_block_translations, :button_primary_description, :text
    add_column :homepage_block_translations, :button_secondary_description, :text

    TRANSLATIONS.each do |key, translations|
      tv = TranslationValue.find_or_create_by(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end
  end

  def down
    remove_column :homepage_block_translations, :button_primary_description
    remove_column :homepage_block_translations, :button_secondary_description

    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end
