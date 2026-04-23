class ChangeLoginTranslations < ActiveRecord::Migration[8.0]
  KEYS_TO_REMOVE = [
    'login_name',
    'login_page',
    'logout_page',
    'dictionary.back_to_top_template.back_to_top',
    'dictionary.back_to_top_template.image_back_to_top',
    'dictionary.header_template.content',
    'dictionary.header_template.logoff',
    'dictionary.header_template.service_navigation',
    'dictionary.header_template.skip',
    'dictionary.print_version_template.print_logo',
    'dictionary.print_version_template.print_preview_only',
    'modules.site_startpage.access.heading',
    'modules.site_startpage.access.text',
    'modules.site_startpage.access_requested',
    'modules.site_startpage.catalog.heading',
    'modules.site_startpage.catalog.text1',
    'modules.site_startpage.catalog.text2',
    'modules.site_startpage.catalog.text3',
    'modules.site_startpage.instructions',
    'modules.site_startpage.introduction.text1',
    'modules.site_startpage.introduction.text2',
    'modules.site_startpage.introduction.text3',
    'modules.site_startpage.introduction.text4',
    'modules.site_startpage.introduction.text5',
    'modules.site_startpage.more_results',
    'modules.site_startpage.no_access',
    'modules.site_startpage.sample_archives',
    'modules.site_startpage.search.heading',
    'modules.site_startpage.search.text1',
    'modules.site_startpage.search.text2',
    'modules.site_startpage.search.text3',
    'modules.site_startpage.stats',
    'modules.site_startpage.text2',
    'modules.site_startpage.under_construction',
  ].freeze

  NEW_TRANSLATIONS = {
    'login': {
        de: 'Anmelden',
        en: 'Log in',
        el: 'Είσοδος',
        es: 'Iniciar sesión',
        ru: 'Войти',
        uk: 'Вхід',
        ar: 'تسجيل الدخول',
    },
    'logout': {
        de: 'Abmelden',
        en: 'Log out',
        el: 'Αποσύνδεση',
        es: 'Cerrar sesión',
        ru: 'Выйти',
        uk: 'Вихід',
        ar: 'تسجيل الخروج',
    },
    'devise.sessions.logout': {
        de: 'Abmelden',
        en: 'Log out',
        el: 'Αποσύνδεση',
        es: 'Cerrar sesión',
        ru: 'Выход',
        uk: 'Вихід',
        ar: 'تسجيل الخروج',
    },
    'user.registration': {
        de: 'Registrieren',
        en: 'Register',
        el: 'Εγγραφή',
        es: 'Registrarse',
        ru: 'Регистрация',
        uk: 'Реєстрація',
        ar: 'تسجيل',
    },
    'devise.registrations.link': {
        de: 'Registrieren',
        en: 'Register',
        el: 'Εγγραφή',
        es: 'Registrarse',
        ru: 'Регистрация',
        uk: 'Реєстрація',
        ar: 'تسجيل',
    },
  }.freeze

  OLD_TRANSLATIONS = {
    'login': {
        de: 'Anmelden',
        en: 'Login',
        el: 'Είσοδος',
        es: 'Iniciar sesión',
        ru: 'Войти',
        uk: 'Вхід',
        ar: 'تسجيل الدخول',
    },
    'logout': {
        de: 'Abmelden',
        en: 'Logout',
        el: 'Αποσύνδεση',
        es: 'Cerrar sesión',
        ru: 'Выйти',
        uk: 'Вихід',
        ar: 'تسجيل الخروج',
    },
    'devise.sessions.logout': {
        de: 'abmelden',
        en: 'sign out',
        el: 'abmelden',
        es: 'abmelden',
        ru: 'Выйти',
        uk: 'Вихід',
        ar: 'تسجيل الخروج',
    },
    'user.registration': {
        de: 'Registrierung',
        en: 'Registration',
        el: 'Εγγραφή',
        es: 'Registrar',
        ru: 'Регистрация',
        uk: 'Реєстрація',
        ar: 'التسجيل',
    },
    'devise.registrations.link': {
        de: 'Registrierung',
        en: 'Registration',
        el: 'Εγγραφή',
        es: 'Registro',
        ru: 'Регистрация',
        uk: 'Реєстрація',
        ar: 'تسجيل',
    },
  }.freeze

  REMOVED_TRANSLATIONS = {
    'login_name': {
      de: 'Login',
      en: 'Login',
      el: 'Χρήστης',
      es: 'Usuaria/o',
      ru: 'логин',
    },
    'login_page': {
      de: 'Login',
      en: 'Login',
      el: 'Είσοδος',
      es: 'Usuaria/o',
      ru: 'Войти',
      uk: 'Вхід',
      ar: 'تسجيل الدخول',
    },
    'logout_page': {
      de: 'Logout',
      en: 'Logout',
      el: 'Έξοδος',
      es: 'Cerrar sesión',
      ru: 'Выйти',
    },
    'dictionary.back_to_top_template.back_to_top': {
      de: '',
      ru: 'В начало страницы',
    },
    'dictionary.back_to_top_template.image_back_to_top': {
      de: '',
      ru: "Значок 'вверх'",
    },
    'dictionary.header_template.content': {
      de: '',
      ru: 'Контент',
    },
    'dictionary.header_template.logoff': {
      de: '',
      ru: 'Выйти',
    },
    'dictionary.header_template.service_navigation': {
      de: '',
      ru: 'Сервисная навигация',
    },
    'dictionary.header_template.skip': {
      de: '',
      ru: 'Перейти сразу к',
    },
    'dictionary.print_version_template.print_logo': {
      de: '',
      ru: 'Печатная версия логотипа',
    },
    'dictionary.print_version_template.print_preview_only': {
      de: '',
      ru: 'Данные графические изображения используются только в предварительном просмотре перед печатью.',
    },
    'modules.site_startpage.access.heading': {
      de: 'Anmeldung',
      en: 'Registration',
    },
    'modules.site_startpage.access.text': {
      de: 'Um die Persönlichkeitsrechte der Interviewten zu schützen, verlangen die meisten Archive eine Anmeldung. Bitte registrieren Sie sich in Oral-History.Digital und lassen Sie sich für einzelne Archive freischalten, um auf die vollständigen Interviews zugreifen zu können.',
      en: 'To protect the privacy rights of interviewees, most archives require registration. Please register in Oral-History.Digital and have your account activated for individual archives to access full interviews.',
    },
    'modules.site_startpage.access_requested': {
      de: 'Freischaltung beantragt',
      en: 'Access requested',
    },
    'modules.site_startpage.catalog.heading': {
      de: 'Katalog',
      en: 'Catalogue',
    },
    'modules.site_startpage.catalog.text1': {
      de: 'Der',
      en: 'The',
    },
    'modules.site_startpage.catalog.text2': {
      de: 'Katalog',
      en: 'catalogue',
    },
    'modules.site_startpage.catalog.text3': {
      de: 'verzeichnet die Institutionen, Archive und Sammlungen. Die <b>Archive</b> haben unterschiedliche Metadaten und Zugangsregelungen. <b>Sammlungen</b> sind einzelne Teilbestände innerhalb dieser Archive.',
      en: 'The catalog lists institutions, archives and collections. <b>Archives</b> have different metadata and access rules. <b>Collections</b> are individual subholdings within these archives.',
    },
    'modules.site_startpage.instructions': {
      de: 'Anleitung für die Redaktionsansicht',
      en: 'Instructions for the editorial view',
    },
    'modules.site_startpage.introduction.text1': {
      de: '<b>Oral-History.Digital</b> ist eine Erschließungs- und Recherche-Plattform für Audio- oder Video-Interviews mit Zeitzeuginnen und Zeitzeugen. Derzeit verzeichnet <b>Oral-History.Digital</b>',
      en: '<b>Oral-History.Digital</b> is a curation and research platform for collections of audio-visual narrative interviews. Currently, <b>Oral-History.Digital</b> lists',
    },
    'modules.site_startpage.introduction.text2': {
      de: 'Archive mit',
      en: 'archives with',
    },
    'modules.site_startpage.introduction.text3': {
      de: 'Sammlungen und',
      en: 'collections and',
    },
    'modules.site_startpage.introduction.text4': {
      de: 'Interviews von',
      en: 'interviews from',
    },
    'modules.site_startpage.introduction.text5': {
      de: 'Institutionen. Das Portal ist noch im Aufbau. Hintergrund-Informationen finden Sie auf der <a href="https://www.oral-history.digital" target="_blank" rel="noreferrer">begleitenden Webseite</a>. Eine Anleitung bieten die <a href="https://www.oral-history.digital/hilfe/index.html" target="_blank" rel="noreferrer">Hilfeseiten</a>.',
      en: 'institutions. The portal is still under construction. Background information can be found on the <a href="https://www.oral-history.digital/en/index.html" target="_blank" rel="noreferrer">accompanying website</a>. A guide is provided in German on the <a href="https://www.oral-history.digital/en/hilfe/index.html" target="_blank" rel="noreferrer">help pages</a>.',
    },
    'modules.site_startpage.more_results': {
      de: 'Mehr Ergebnisse laden',
      en: 'Load more results',
    },
    'modules.site_startpage.no_access': {
      de: 'Freischaltung erforderlich',
      en: 'Access required',
    },
    'modules.site_startpage.sample_archives': {
      de: 'Beispielarchive',
      en: 'Sample Archives',
    },
    'modules.site_startpage.search.heading': {
      de: 'Suche',
      en: 'Search',
    },
    'modules.site_startpage.search.text1': {
      de: 'Die',
      en: 'The',
    },
    'modules.site_startpage.search.text2': {
      de: 'Suche',
      en: 'search',
    },
    'modules.site_startpage.search.text3': {
      de: 'führt zu einzelnen Interviews aus verschiedenen Archiven. <b>Filtern</b> können Sie z.B. nach Thema, Sprache oder Geschlecht. Im <b>Volltext</b> können Sie nur in den  Archiven suchen, für die Sie freigeschaltet sind.',
      en: 'leads to individual interviews from different archives. You can <b>filter</b> e.g. by topic, language or gender. <b>Full text search</b> is only available in the archives for which your account is activated.',
    },
    'modules.site_startpage.stats': {
      de: 'Derzeit verzeichnet Oral-History.Digital %{numProjects} Archive mit %{numCollections} Sammlungen und %{numInterviews} Interviews von %{numInstitutions} Institutionen.',
      en: 'Currently, Oral-History.Digital lists %{numProjects} archives with %{numCollections} collections and %{numInterviews} interviews from %{numInstitutions} institutions.',
    },
    'modules.site_startpage.text2': {
      de: 'Suche',
      en: 'Suche',
    },
    'modules.site_startpage.under_construction': {
      de: 'Das Portal ist noch im Aufbau.',
      en: 'The portal is still under construction.',
    },
  }.freeze

  def up
    apply_translations(NEW_TRANSLATIONS)
    remove_translations(KEYS_TO_REMOVE)
  end

  def down
    restore_translations(REMOVED_TRANSLATIONS)
    apply_translations(OLD_TRANSLATIONS)
  end

  private

  def apply_translations(translations_by_key)
    translations_by_key.each do |key, translations|
      tv = TranslationValue.find_by(key: key)
      next if tv.nil?

      translations.each do |locale, value|
        translation = tv.translations.find_by(locale: locale.to_s)
        next if translation.nil?

        translation.update!(value: value)
      end
    end
  end

  def remove_translations(keys)
    TranslationValue.where(key: keys).destroy_all
  end

  def restore_translations(translations_by_key)
    translations_by_key.each do |key, translations|
      tv = TranslationValue.find_or_create_by!(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update!(value: value)
      end
    end
  end
end
