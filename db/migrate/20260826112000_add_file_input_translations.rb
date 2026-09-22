class AddFileInputTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'file_input.remove' => {
      de: 'Datei entfernen',
      en: 'Remove file',
      el: 'Αφαίρεση αρχείου',
      es: 'Eliminar archivo',
      ru: 'Удалить файл',
      uk: 'Видалити файл',
      ar: 'إزالة الملف',
    },
    'file_input.discard' => {
      de: 'Auswahl verwerfen',
      en: 'Discard selection',
      el: 'Απόρριψη επιλογής',
      es: 'Descartar selección',
      ru: 'Отменить выбор',
      uk: 'Скасувати вибір',
      ar: 'إلغاء الاختيار',
    },
    'file_input.errors.invalid_type' => {
      de: '%{filename} ist kein zulässiger Dateityp.',
      en: '%{filename} is not an accepted file type.',
      el: 'Το %{filename} δεν είναι αποδεκτός τύπος αρχείου.',
      es: '%{filename} no es un tipo de archivo permitido.',
      ru: 'Тип файла %{filename} не поддерживается.',
      uk: 'Тип файлу %{filename} не підтримується.',
      ar: 'نوع الملف %{filename} غير مقبول.',
    },
    'file_input.errors.file_too_large' => {
      de: '%{filename} überschreitet die maximal zulässige Dateigröße.',
      en: '%{filename} exceeds the maximum file size.',
      el: 'Το %{filename} υπερβαίνει το μέγιστο μέγεθος αρχείου.',
      es: '%{filename} supera el tamaño máximo permitido.',
      ru: 'Файл %{filename} превышает допустимый размер.',
      uk: 'Файл %{filename} перевищує допустимий розмір.',
      ar: 'يتجاوز الملف %{filename} الحجم الأقصى المسموح به.',
    },
    'file_input.errors.too_many_files' => {
      de: 'Es dürfen maximal %{count} Dateien ausgewählt werden.',
      en: 'A maximum of %{count} files may be selected.',
      el: 'Μπορούν να επιλεγούν έως %{count} αρχεία.',
      es: 'Se pueden seleccionar como máximo %{count} archivos.',
      ru: 'Можно выбрать не более %{count} файлов.',
      uk: 'Можна вибрати не більше %{count} файлів.',
      ar: 'يمكن تحديد %{count} ملفات كحد أقصى.',
    },
    'file_input.errors.empty_file' => {
      de: '%{filename} ist leer.',
      en: '%{filename} is empty.',
      el: 'Το %{filename} είναι κενό.',
      es: '%{filename} está vacío.',
      ru: 'Файл %{filename} пуст.',
      uk: 'Файл %{filename} порожній.',
      ar: 'الملف %{filename} فارغ.',
    },
    'file_input.instruction' => {
      de: 'Wählen Sie eine Datei von Ihrem Gerät aus.',
      en: 'Select a file from your device.',
      el: 'Επιλέξτε ένα αρχείο από τη συσκευή σας.',
      es: 'Seleccione un archivo de su dispositivo.',
      ru: 'Выберите файл на вашем устройстве.',
      uk: 'Виберіть файл на своєму пристрої.',
      ar: 'اختر ملفًا من جهازك.',
    },
    'file_input.instruction_multiple' => {
      de: 'Wählen Sie Dateien von Ihrem Gerät aus.',
      en: 'Select files from your device.',
      el: 'Επιλέξτε αρχεία από τη συσκευή σας.',
      es: 'Seleccione archivos de su dispositivo.',
      ru: 'Выберите файлы на вашем устройстве.',
      uk: 'Виберіть файли на своєму пристрої.',
      ar: 'اختر ملفات من جهازك.',
    },
    'file_input.choose' => {
      de: 'Datei auswählen',
      en: 'Choose file',
      el: 'Επιλογή αρχείου',
      es: 'Elegir archivo',
      ru: 'Выбрать файл',
      uk: 'Вибрати файл',
      ar: 'اختيار ملف',
    },
    'file_input.choose_multiple' => {
      de: 'Dateien auswählen',
      en: 'Choose files',
      el: 'Επιλογή αρχείων',
      es: 'Elegir archivos',
      ru: 'Выбрать файлы',
      uk: 'Вибрати файли',
      ar: 'اختيار ملفات',
    },
    'edit.project.favicon.success_title' => {
      de: 'Änderung gespeichert',
      en: 'Change saved',
      el: 'Η αλλαγή αποθηκεύτηκε',
      es: 'Cambio guardado',
      ru: 'Изменение сохранено',
      uk: 'Зміну збережено',
      ar: 'تم حفظ التغيير',
    },
    'edit.project.favicon.error_title' => {
      de: 'Favicon konnte nicht geändert werden',
      en: 'Favicon could not be changed',
      el: 'Δεν ήταν δυνατή η αλλαγή του favicon',
      es: 'No se pudo cambiar el favicon',
      ru: 'Не удалось изменить значок сайта',
      uk: 'Не вдалося змінити піктограму сайту',
      ar: 'تعذر تغيير أيقونة الموقع',
    },
    'file_input.add_another' => {
      de: 'Weitere Datei hinzufügen',
      en: 'Add another file',
      el: 'Προσθήκη άλλου αρχείου',
      es: 'Añadir otro archivo',
      ru: 'Добавить ещё один файл',
      uk: 'Додати ще один файл',
      ar: 'إضافة ملف آخر',
    },
    'file_input.replace' => {
      de: 'Datei ersetzen',
      en: 'Replace file',
      el: 'Αντικατάσταση αρχείου',
      es: 'Reemplazar archivo',
      ru: 'Заменить файл',
      uk: 'Замінити файл',
      ar: 'استبدال الملف',
    },
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      translation_value = TranslationValue.find_or_create_by!(key: key)

      translations.each do |locale, value|
        translation = translation_value.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update!(value: value)
      end
    end
  end

  def down
    TranslationValue.where(key: TRANSLATIONS.keys).destroy_all
  end
end
