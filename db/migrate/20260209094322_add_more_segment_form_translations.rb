class AddMoreSegmentFormTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.segment.annotations.empty': {
      de: 'Keine Anmerkungen vorhanden',
      en: 'No annotations available',
      el: 'Δεν υπάρχουν σχόλια',
      es: 'No hay anotaciones disponibles',
      ru: 'Нет доступных аннотаций'
    },
    'edit.segment.annotations.add': {
      de: 'Anmerkung hinzufügen',
      en: 'Add annotation',
      el: 'Προσθήκη σχολίου',
      es: 'Añadir anotación',
      ru: 'Добавить аннотацию',
    },
    'edit.segment.references.empty': {
      de: 'Keine Verknüpfungen zu Registereinträgen vorhanden',
      en: 'No registry references available',
      el: 'Δεν υπάρχουν αναφορές μητρώου',
      es: 'Sin referencias de registro disponibles',
      ru: 'Нет доступных ссылок реестра'
    },
    'edit.segment.references.add': {
      de: 'Registereintrag verknüpfen',
      en: 'Link registry entry',
      el: 'Σύνδεση καταχώρησης μητρώου',
      es: 'Vincular entrada de registro',
      ru: 'Связать запись реестра'
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
