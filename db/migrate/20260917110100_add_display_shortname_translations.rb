class AddDisplayShortnameTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'activerecord.attributes.project.shortname_help' => {
      de: 'Kurzer technischer Name des Projekts, der in der Webadresse (URL) erscheint. Eine Änderung kann dazu führen, dass bestehende Links nicht mehr funktionieren.',
      en: 'Short technical name of the project that appears in the web address (URL). Changing it can cause existing links to stop working.',
      el: 'Σύντομο τεχνικό όνομα του έργου που εμφανίζεται στη διεύθυνση ιστού (URL). Η αλλαγή του μπορεί να προκαλέσει τη διακοπή λειτουργίας υπαρχόντων συνδέσμων.',
      es: 'Nombre técnico corto del proyecto que aparece en la dirección web (URL). Cambiarlo puede hacer que los enlaces existentes dejen de funcionar.',
      ru: 'Краткое техническое название проекта, которое отображается в веб-адресе (URL). Его изменение может привести к тому, что существующие ссылки перестанут работать.',
      uk: 'Коротка технічна назва проєкту, яка відображається у вебадресі (URL). Її зміна може призвести до того, що наявні посилання перестануть працювати.',
      ar: 'اسم تقني مختصر للمشروع يظهر في عنوان الويب (URL). قد يؤدي تغييره إلى توقف الروابط الحالية عن العمل.',
    },
    'activerecord.attributes.project.display_shortname' => {
      de: 'Kurzbezeichnung für die Anzeige',
      en: 'Display short name',
      el: 'Σύντομη ονομασία εμφάνισης',
      es: 'Nombre corto para mostrar',
      ru: 'Отображаемое краткое название',
      uk: 'Коротка назва для відображення',
      ar: 'الاسم المختصر المعروض',
    },
    'activerecord.attributes.project.display_shortname_help' => {
      de: 'Wird in nutzerseitigen Bezeichnungen verwendet und ändert keine URLs oder andere technische Kennungen. Wenn dieses Feld leer ist, wird das technische Kürzel verwendet.',
      en: 'Used in user-facing labels and does not change URLs or other technical identifiers. When this field is blank, the technical shortname is used.',
      el: 'Χρησιμοποιείται σε ονομασίες που εμφανίζονται στους χρήστες και δεν αλλάζει τις διευθύνσεις URL ή άλλα τεχνικά αναγνωριστικά. Όταν αυτό το πεδίο είναι κενό, χρησιμοποιείται η τεχνική σύντομη ονομασία.',
      es: 'Se utiliza en las etiquetas visibles para las personas usuarias y no modifica las URL ni otros identificadores técnicos. Si este campo está vacío, se utiliza el nombre corto técnico.',
      ru: 'Используется в подписях, видимых пользователям, и не изменяет URL-адреса или другие технические идентификаторы. Если это поле пусто, используется техническое краткое обозначение.',
      uk: 'Використовується в підписах, видимих користувачам, і не змінює URL-адреси чи інші технічні ідентифікатори. Якщо це поле порожнє, використовується технічне коротке позначення.',
      ar: 'يُستخدم في التسميات الظاهرة للمستخدمين ولا يغيّر عناوين URL أو المعرّفات التقنية الأخرى. عند ترك هذا الحقل فارغًا، يُستخدم الاختصار التقني.',
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
