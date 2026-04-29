class RenameSiteStartpageKeysToHomepageKeys < ActiveRecord::Migration[8.0]
  KEY_MAPPINGS = {
    'modules.site_startpage.sample_archives' => 'modules.homepage.sample_archives',
    'modules.site_startpage.access_requested' => 'modules.homepage.access_requested',
    'modules.site_startpage.no_access' => 'modules.homepage.no_access',
    'modules.site_startpage.previous' => 'modules.homepage.previous',
    'modules.site_startpage.next' => 'modules.homepage.next',
  }.freeze

  NEW_TRANSLATIONS = {
    'modules.homepage.sample_archives': {
      de: 'Beispielarchive',
      en: 'Sample Archives',
      el: 'Δείγματα αρχείων',
      es: 'Archivos de ejemplo',
      ru: 'Пример архивов',
      uk: 'Приклади архівів',
      ar: 'أرشيفات نموذجية',
    },
    'modules.homepage.access_requested': {
      de: 'Freischaltung beantragt',
      en: 'Access requested',
      el: 'Η πρόσβαση ζητήθηκε',
      es: 'Acceso solicitado',
      ru: 'Запрос на доступ отправлен',
      uk: 'Запит на доступ надіслано',
      ar: 'تم طلب الوصول',
    },
    'modules.homepage.no_access': {
      de: 'Freischaltung erforderlich',
      en: 'Access required',
      el: 'Απαιτείται πρόσβαση',
      es: 'Se requiere acceso',
      ru: 'Требуется доступ',
      uk: 'Потрібен доступ',
      ar: 'الوصول مطلوب',
    },
    'modules.homepage.previous': {
      de: 'Zurück',
      en: 'Previous',
      el: 'Προηγούμενο',
      es: 'Anterior',
      ru: 'Предыдущий',
      uk: 'Попередній',
      ar: 'السابق',
    },
    'modules.homepage.next': {
      de: 'Weiter',
      en: 'Next',
      el: 'Επόμενο',
      es: 'Siguiente',
      ru: 'Следующий',
      uk: 'Наступний',
      ar: 'التالي',
    },
  }.freeze

  OLD_TRANSLATIONS = {
    'modules.site_startpage.sample_archives': {
      de: 'Beispielarchive',
      en: 'Sample Archives',
    },
    'modules.site_startpage.access_requested': {
      de: 'Freischaltung beantragt',
      en: 'Access requested',
    },
    'modules.site_startpage.no_access': {
      de: 'Freischaltung erforderlich',
      en: 'Access required',
    },
    'modules.site_startpage.previous': {
      de: 'Zurück',
      en: 'Previous',
      el: 'Προηγούμενο',
      es: 'Anterior',
      ru: 'Предыдущий',
      uk: 'Попередній',
      ar: 'السابق',
    },
    'modules.site_startpage.next': {
      de: 'Weiter',
      en: 'Next',
      el: 'Επόμενο',
      es: 'Siguiente',
      ru: 'Следующий',
      uk: 'Наступний',
      ar: 'التالي',
    },
  }.freeze

  def up
    migrate_keys(KEY_MAPPINGS)
    apply_translations(NEW_TRANSLATIONS)
    remove_translations(KEY_MAPPINGS.keys)
  end

  def down
    apply_translations(OLD_TRANSLATIONS)
    remove_translations(KEY_MAPPINGS.values)
  end

  private

  def migrate_keys(mappings)
    mappings.each do |from_key, to_key|
      from_tv = TranslationValue.includes(:translations).find_by(key: from_key)
      next if from_tv.nil?

      to_tv = TranslationValue.find_or_create_by!(key: to_key)

      from_tv.translations.each do |translation|
        target_translation = to_tv.translations.find_or_initialize_by(locale: translation.locale)
        target_translation.update!(value: translation.value)
      end
    end
  end

  def apply_translations(translations_by_key)
    translations_by_key.each do |key, translations|
      tv = TranslationValue.find_or_create_by!(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update!(value: value)
      end
    end
  end

  def remove_translations(keys)
    TranslationValue.where(key: keys).destroy_all
  end
end
