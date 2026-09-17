class AddBreadcrumbLogoTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.instance.breadcrumb_logos.title' => {
      de: 'Logos in der Breadcrumb-Navigation',
      en: 'Breadcrumb logos',
      el: 'Λογότυπα πλοήγησης breadcrumb',
      es: 'Logotipos de navegación de migas de pan',
      ru: 'Логотипы в навигационной цепочке',
      uk: 'Логотипи в навігаційному ланцюжку',
      ar: 'شعارات مسار التنقل',
    },

    'edit.instance.breadcrumb_logos.description' => {
      de: 'Dieses Logo erscheint in der Breadcrumb-Navigation des Hauptprojekts. Optional kann ein zweites Logo für andere Projekte hinterlegt werden.',
      en: 'This logo appears in the breadcrumb navigation of the umbrella project. You can optionally add a second logo for other projects.',
      el: 'Αυτό το λογότυπο εμφανίζεται στην πλοήγηση breadcrumb του κύριου έργου. Μπορείτε προαιρετικά να προσθέσετε ένα δεύτερο λογότυπο για άλλα έργα.',
      es: 'Este logotipo aparece en la navegación de migas de pan del proyecto paraguas. Opcionalmente puede añadir un segundo logotipo para otros proyectos.',
      ru: 'Этот логотип отображается в навигационной цепочке основного проекта. При необходимости можно добавить второй логотип для других проектов.',
      uk: 'Цей логотип відображається в навігаційному ланцюжку основного проєкту. За потреби можна додати другий логотип для інших проєктів.',
      ar: 'يظهر هذا الشعار في مسار التنقل الخاص بالمشروع الرئيسي. ويمكنك اختياريًا إضافة شعار ثانٍ للمشاريع الأخرى.',
    },

    'edit.instance.breadcrumb_logos.umbrella' => {
      de: 'Logo für das Hauptprojekt',
      en: 'Umbrella project logo',
      el: 'Λογότυπο κύριου έργου',
      es: 'Logotipo del proyecto paraguas',
      ru: 'Логотип основного проекта',
      uk: 'Логотип основного проєкту',
      ar: 'شعار المشروع الرئيسي',
    },

    'edit.instance.breadcrumb_logos.projects' => {
      de: 'Logo für andere Projekte',
      en: 'Logo for other projects',
      el: 'Λογότυπο για άλλα έργα',
      es: 'Logotipo para otros proyectos',
      ru: 'Логотип для других проектов',
      uk: 'Логотип для інших проєктів',
      ar: 'شعار للمشاريع الأخرى',
    },

    'edit.instance.breadcrumb_logos.help' => {
      de: 'PNG oder SVG, maximal 1 MB. Wenn nur ein Logo vorhanden ist, wird es überall verwendet. Ohne Logo werden die Standard-Logos verwendet.',
      en: 'PNG or SVG, up to 1 MB. When only one logo is provided, it is used everywhere. Without a logo, the default logos are used.',
      el: 'PNG ή SVG, έως 1 MB. Όταν παρέχεται μόνο ένα λογότυπο, χρησιμοποιείται παντού. Χωρίς λογότυπο, χρησιμοποιούνται τα προεπιλεγμένα λογότυπα.',
      es: 'PNG o SVG, hasta 1 MB. Si solo se proporciona un logotipo, se utiliza en todas partes. Sin logotipo, se utilizan los logotipos predeterminados.',
      ru: 'PNG или SVG, до 1 МБ. Если указан только один логотип, он используется везде. Если логотип не указан, используются стандартные логотипы.',
      uk: 'PNG або SVG, до 1 МБ. Якщо вказано лише один логотип, він використовується всюди. Якщо логотип не вказано, використовуються стандартні логотипи.',
      ar: 'PNG أو SVG، حتى 1 ميغابايت. عند توفير شعار واحد فقط، يُستخدم في كل مكان. وبدون شعار، تُستخدم الشعارات الافتراضية.',
    },

    'edit.instance.breadcrumb_logos.remove_button' => {
      de: 'Entfernen',
      en: 'Remove',
      el: 'Αφαίρεση',
      es: 'Eliminar',
      ru: 'Удалить',
      uk: 'Видалити',
      ar: 'إزالة',
    },
    
    'edit.instance.breadcrumb_logos.remove_confirm' => {
      de: 'Logo entfernen?',
      en: 'Remove logo?',
      el: 'Αφαίρεση λογότυπου;',
      es: '¿Eliminar logotipo?',
      ru: 'Удалить логотип?',
      uk: 'Видалити логотип?',
      ar: 'إزالة الشعار؟',
    },

    'edit.instance.breadcrumb_logos.remove_warning' => {
      de: 'Das Logo wird dauerhaft entfernt.',
      en: 'This logo will be removed permanently.',
      el: 'Το λογότυπο θα αφαιρεθεί οριστικά.',
      es: 'El logotipo se eliminará permanentemente.',
      ru: 'Логотип будет удалён навсегда.',
      uk: 'Логотип буде видалено назавжди.',
      ar: 'ستتم إزالة الشعار نهائيًا.',
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
