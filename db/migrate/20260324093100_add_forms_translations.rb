class AddFormsTranslations < ActiveRecord::Migration[8.0]
    TRANSLATIONS = {
      'modules.forms.save_success': {
          de: 'Erfolgreich gespeichert',
          en: 'Saved successfully',
          el: 'Αποθηκεύτηκε με επιτυχία',
          es: 'Guardado correctamente',
          ru: 'Сохранено успешно',
          uk: 'Збережено успішно',
          ar: 'تم الحفظ بنجاح',
      },
      'modules.forms.save_error': {
          de: 'Fehler beim Speichern',
          en: 'Error saving',
          el: 'Σφάλμα κατά την αποθήκευση',
          es: 'Error al guardar',
          ru: 'Ошибка при сохранении',
          uk: 'Помилка під час збереження',
          ar: 'حدث خطأ أثناء الحفظ',
      },
      'close': {
          de: 'Schließen',
          en: 'Close',
          el: 'Κλείσιμο',
          es: 'Cerrar',
          ru: 'Закрыть',
          uk: 'Закрити',
          ar: 'إغلاق',
      }
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
