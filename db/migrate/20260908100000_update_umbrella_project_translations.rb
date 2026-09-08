class UpdateUmbrellaProjectTranslations < ActiveRecord::Migration[8.0]
  OLD_TRANSLATIONS = {
    'edit.instance.umbrella_project_id': {
      de: 'ID des Hauptprojekts',
      en: 'Umbrella project ID',
      el: 'ID έργου-ομπρέλα',
      es: 'ID del proyecto paraguas',
      ru: 'ID зонтичного проекта',
      uk: 'ID парасолькового проєкту',
      ar: 'معرّف المشروع المظلة',
    },
    'edit.instance.umbrella_project_help': {
      de: 'ID des Hauptprojekts, das in der Instanz als "Dach" fungiert und unter anderem den Katalog beinhaltet.',
      en: 'ID of the main project that serves as the "umbrella" for the instance and includes the catalog, among other things.',
      el: 'ID του κύριου έργου που λειτουργεί ως "ομπρέλα" για την παρουσία και περιλαμβάνει, μεταξύ άλλων, τον κατάλογο.',
      es: 'ID del proyecto principal que sirve como "paraguas" para la instancia e incluye el catálogo, entre otras cosas.',
      ru: 'ID основного проекта, который служит "зонтом" для инстанса и включает в себя каталог, среди прочего.',
      uk: 'ID основного проєкту, який служить "парасолем" для інстансу та включає в себе каталог, серед іншого.',
      ar: 'معرّف المشروع الرئيسي الذي يعمل كـ "مظلة" للمثيل ويشمل الكتالوج، من بين أشياء أخرى.',
    },
  }.freeze

  NEW_TRANSLATIONS = {
    'edit.instance.umbrella_project_id': {
      de: 'Hauptprojekt',
      en: 'Umbrella project',
      el: 'Έργο-ομπρέλα',
      es: 'Proyecto paraguas',
      ru: 'Зонтичный проект',
      uk: 'Парасольковий проєкт',
      ar: 'المشروع المظلة',
    },
    'edit.instance.umbrella_project_help': {
      de: 'Das Hauptprojekt, das in der Instanz als "Dach" fungiert und unter anderem den Katalog beinhaltet.',
      en: 'The main project that serves as the "umbrella" for the instance and includes the catalog, among other things.',
      el: 'Το κύριο έργο που λειτουργεί ως "ομπρέλα" για την παρουσία και περιλαμβάνει, μεταξύ άλλων, τον κατάλογο.',
      es: 'El proyecto principal que sirve como "paraguas" para la instancia e incluye el catálogo, entre otras cosas.',
      ru: 'Основной проект, который служит "зонтом" для инстанса и включает в себя каталог, среди прочего.',
      uk: 'Основний проєкт, який служить "парасолею" для інстансу та включає каталог, серед іншого.',
      ar: 'المشروع الرئيسي الذي يعمل كـ "مظلة" للمثيل ويشمل الكتالوج، من بين أشياء أخرى.',
    },
  }.freeze

  def up
    apply_translations(NEW_TRANSLATIONS)
  end

  def down
    apply_translations(OLD_TRANSLATIONS)
  end

  private

  def apply_translations(translations_by_key)
    translations_by_key.each do |key, translations|
      translation_value = TranslationValue.find_or_create_by!(key: key)

      translations.each do |locale, value|
        translation = translation_value.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update!(value: value)
      end
    end
  end
end
