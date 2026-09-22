class AddProjectFaviconTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'activerecord.attributes.project.favicon' => {
      de: 'Favicon',
      en: 'Favicon',
      el: 'Εικονίδιο ιστοτόπου',
      es: 'Favicon',
      ru: 'Значок сайта',
      uk: 'Піктограма сайту',
      ar: 'أيقونة الموقع',
    },
    'edit.project.favicon.description' => {
      de: 'Ein Favicon ist das kleine Symbol, das in Browser-Tabs und Lesezeichen angezeigt wird.',
      en: 'A favicon is the small icon shown in browser tabs and bookmarks.',
      el: 'Το εικονίδιο ιστοτόπου είναι το μικρό σύμβολο που εμφανίζεται στις καρτέλες και στους σελιδοδείκτες του προγράμματος περιήγησης.',
      es: 'Un favicon es el pequeño icono que aparece en las pestañas y los marcadores del navegador.',
      ru: 'Фавикон — это маленький значок, который отображается на вкладках и в закладках браузера.',
      uk: 'Фавікон — це маленька піктограма, яка відображається на вкладках і в закладках браузера.',
      ar: 'أيقونة الموقع هي الرمز الصغير الذي يظهر في علامات تبويب المتصفح والإشارات المرجعية.',
    },
    'edit.project.favicon.remove' => {
      de: 'Favicon entfernen',
      en: 'Remove favicon',
      el: 'Αφαίρεση εικονιδίου ιστοτόπου',
      es: 'Eliminar favicon',
      ru: 'Удалить значок сайта',
      uk: 'Видалити піктограму сайту',
      ar: 'إزالة أيقونة الموقع',
    },
    'edit.project.favicon.remove_confirm' => {
      de: 'Favicon wirklich entfernen?',
      en: 'Remove the favicon?',
      el: 'Να αφαιρεθεί το εικονίδιο ιστοτόπου;',
      es: '¿Eliminar el favicon?',
      ru: 'Удалить значок сайта?',
      uk: 'Видалити піктограму сайту?',
      ar: 'هل تريد إزالة أيقونة الموقع؟',
    },
    'edit.project.favicon.help' => {
      de: 'PNG oder ICO, maximal 1 MB.',
      en: 'PNG or ICO, maximum 1 MB.',
      el: 'PNG ή ICO, έως 1 MB.',
      es: 'PNG o ICO, máximo 1 MB.',
      ru: 'PNG или ICO, не более 1 МБ.',
      uk: 'PNG або ICO, не більше 1 МБ.',
      ar: 'PNG أو ICO، بحد أقصى 1 ميغابايت.',
    },
    'edit.project.favicon.invalid_type' => {
      de: 'Bitte eine PNG- oder ICO-Datei auswählen.',
      en: 'Please select a PNG or ICO file.',
      el: 'Επιλέξτε αρχείο PNG ή ICO.',
      es: 'Seleccione un archivo PNG o ICO.',
      ru: 'Выберите файл PNG или ICO.',
      uk: 'Виберіть файл PNG або ICO.',
      ar: 'يرجى اختيار ملف PNG أو ICO.',
    },
    'edit.project.favicon.file_too_large' => {
      de: 'Die Datei darf maximal 1 MB groß sein.',
      en: 'The file must not exceed 1 MB.',
      el: 'Το αρχείο δεν πρέπει να υπερβαίνει το 1 MB.',
      es: 'El archivo no debe superar 1 MB.',
      ru: 'Размер файла не должен превышать 1 МБ.',
      uk: 'Розмір файлу не повинен перевищувати 1 МБ.',
      ar: 'يجب ألا يتجاوز حجم الملف 1 ميغابايت.',
    },
    'edit.project.favicon.saved' => {
      de: 'Favicon gespeichert.',
      en: 'Favicon saved.',
      el: 'Το εικονίδιο ιστοτόπου αποθηκεύτηκε.',
      es: 'Favicon guardado.',
      ru: 'Значок сайта сохранён.',
      uk: 'Піктограму сайту збережено.',
      ar: 'تم حفظ أيقونة الموقع.',
    },
    'edit.project.favicon.removed' => {
      de: 'Favicon entfernt.',
      en: 'Favicon removed.',
      el: 'Το εικονίδιο ιστοτόπου αφαιρέθηκε.',
      es: 'Favicon eliminado.',
      ru: 'Значок сайта удалён.',
      uk: 'Піктограму сайту видалено.',
      ar: 'تمت إزالة أيقونة الموقع.',
    },
    'edit.project.favicon.failed' => {
      de: 'Das Favicon konnte nicht gespeichert werden.',
      en: 'The favicon could not be saved.',
      el: 'Δεν ήταν δυνατή η αποθήκευση του εικονιδίου ιστοτόπου.',
      es: 'No se pudo guardar el favicon.',
      ru: 'Не удалось сохранить значок сайта.',
      uk: 'Не вдалося зберегти піктограму сайту.',
      ar: 'تعذر حفظ أيقونة الموقع.',
    },
    'edit.project.favicon.remove_warning' => {
      de: 'Das Projekt verwendet anschließend wieder das Standard-Favicon. Diese Änderung kann später durch das Hochladen einer neuen Datei rückgängig gemacht werden.',
      en: 'The project will use the default favicon again. You can undo this later by uploading a new file.',
      el: 'Το έργο θα χρησιμοποιεί ξανά το προεπιλεγμένο εικονίδιο ιστοτόπου. Μπορείτε να αναιρέσετε αυτή την αλλαγή αργότερα ανεβάζοντας ένα νέο αρχείο.',
      es: 'El proyecto volverá a utilizar el favicon predeterminado. Puede deshacer este cambio más adelante subiendo un archivo nuevo.',
      ru: 'Проект снова будет использовать стандартный значок сайта. Позже это изменение можно отменить, загрузив новый файл.',
      uk: 'Проєкт знову використовуватиме стандартну піктограму сайту. Пізніше цю зміну можна скасувати, завантаживши новий файл.',
      ar: 'سيستخدم المشروع أيقونة الموقع الافتراضية مرة أخرى. يمكنك التراجع عن هذا التغيير لاحقًا برفع ملف جديد.',
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
