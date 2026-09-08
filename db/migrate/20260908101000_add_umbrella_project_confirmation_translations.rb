class AddUmbrellaProjectConfirmationTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.instance.umbrella_project_confirm.title': {
      de: 'Hauptprojekt ändern?',
      en: 'Change umbrella project?',
      el: 'Αλλαγή έργου-ομπρέλας;',
      es: '¿Cambiar el proyecto paraguas?',
      ru: 'Изменить зонтичный проект?',
      uk: 'Змінити парасольковий проєкт?',
      ar: 'هل تريد تغيير المشروع المظلة؟',
    },
    'edit.instance.umbrella_project_confirm.warning': {
      de: 'Das Hauptprojekt beeinflusst die Startseite und andere zentrale Bereiche der Website. Ändern Sie es nur, wenn dies beabsichtigt ist.',
      en: 'The umbrella project influences the homepage and other central parts of the website. Change it only if this is intended.',
      el: 'Το έργο-ομπρέλα επηρεάζει την αρχική σελίδα και άλλα κεντρικά μέρη του ιστότοπου. Αλλάξτε το μόνο εάν αυτό είναι σκόπιμο.',
      es: 'El proyecto paraguas influye en la página de inicio y en otras partes centrales del sitio web. Cámbielo solo si es intencionado.',
      ru: 'Зонтичный проект влияет на главную страницу и другие центральные части сайта. Изменяйте его только намеренно.',
      uk: 'Парасольковий проєкт впливає на головну сторінку та інші центральні частини вебсайту. Змінюйте його лише навмисно.',
      ar: 'يؤثر المشروع المظلة في الصفحة الرئيسية وأجزاء مركزية أخرى من الموقع. لا تغيّره إلا إذا كان ذلك مقصودًا.',
    },
    'edit.instance.umbrella_project_confirm.submit': {
      de: 'Hauptprojekt ändern',
      en: 'Change umbrella project',
      el: 'Αλλαγή έργου-ομπρέλας',
      es: 'Cambiar el proyecto paraguas',
      ru: 'Изменить зонтичный проект',
      uk: 'Змінити парасольковий проєкт',
      ar: 'تغيير المشروع المظلة',
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
