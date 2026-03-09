class AddFormTranslationsUiHints < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.form.fix_validation_errors': {
      de: 'Bitte beheben Sie die Validierungsfehler',
      en: 'Please fix validation errors',
      el: 'Παρακαλώ διορθώστε τα σφάλματα επικύρωσης',
      es: 'Por favor corrija los errores de validación',
      ru: 'Пожалуйста, исправьте ошибки валидации'
    },
    'edit.form.fix_errors': {
      de: 'Bitte korrigieren Sie die Fehler',
      en: 'Please fix the errors',
      el: 'Παρακαλώ διορθώστε τα σφάλματα',
      es: 'Por favor corrija los errores',
      ru: 'Пожалуйста, исправьте ошибки',
    },
    'edit.form.no_changes': {
      de: 'Keine Änderungen zum Speichern',
      en: 'No changes to save',
      el: 'Δεν υπάρχουν αλλαγές για αποθήκευση',
      es: 'No hay cambios para guardar',
      ru: 'Нет изменений для сохранения'
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
