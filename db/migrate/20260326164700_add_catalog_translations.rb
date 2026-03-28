class AddCatalogTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.catalog.view_on_map': {
      de: 'Auf Karte anzeigen',
      en: 'View on map',
      el: 'Προβολή στο χάρτη',
      es: 'Ver en el mapa',
      ru: 'Посмотреть на карте',
      uk: 'Переглянути на карті',
      ar: 'عرض على الخريطة',
    },
    'modules.catalog.currently_not_accessible': {
      de: 'derzeit nicht zugänglich',
      en: 'currently not accessible',
      el: 'προς το παρόν μη προσβάσιμα',
      es: 'actualmente no accesibles',
      ru: 'в настоящее время недоступны',
      uk: 'наразі недоступні',
      ar: 'غير متاحة حالياً',
    },
    'modules.catalog.accessible_after_registration': {
      de: 'nach Anmeldung zugänglich',
      en: 'accessible after registration',
      el: 'προσβάσιμα μετά την εγγραφή',
      es: 'accesibles después del registro',
      ru: 'доступны после регистрации',
      uk: 'доступні після реєстрації',
      ar: 'متاحة بعد التسجيل',
    },
    'modules.catalog.accessible_on_demand_after_registration': {
      de: 'auf Anfrage',
      en: 'on demand',
      el: 'προσβάσιμα κατόπιν αιτήματος',
      es: 'bajo solicitud',
      ru: 'доступны по запросу',
      uk: 'доступні за запитом',
      ar: 'متاحة عند الطلب',
    },
    'modules.catalog.accessible_after_registration_count': {
      de: '%{count} nach Anmeldung zugänglich',
      en: '%{count} accessible after registration',
      el: '%{count} προσβάσιμα μετά την εγγραφή',
      es: '%{count} accesibles después del registro',
      ru: '%{count} доступны после регистрации',
      uk: '%{count} доступні після реєстрації',
      ar: '%{count} متاحة بعد التسجيل',
    },
    'modules.catalog.accessible_on_demand_after_registration_count': {
      de: '%{count} auf Anfrage',
      en: '%{count} on demand',
      el: '%{count} προσβάσιμα κατόπιν αιτήματος',
      es: '%{count} bajo solicitud',
      ru: '%{count} по запросу',
      uk: '%{count} за запитом',
      ar: '%{count} عند الطلب',
    },
  }.freeze

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