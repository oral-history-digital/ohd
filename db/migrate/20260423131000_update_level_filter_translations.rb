class UpdateLevelFilterTranslations < ActiveRecord::Migration[8.0]
  KEYS_TO_REMOVE = [
    'explorer.institution_level_filter.option.with_parent',
  ].freeze

  NEW_TRANSLATIONS = {
    'explorer.institution_level_filter.option.all': {
        de: 'Institutionen und Untereinrichtungen anzeigen',
        en: 'Show all institutions and sub-divisions',
        el: 'Εμφάνιση όλων των ιδρυμάτων και υπομονάδων',
        es: 'Mostrar todas las instituciones y subunidades',
        ru: 'Показать все учреждения и подразделения',
        uk: 'Показати всі установи та підрозділи',
        ar: 'عرض جميع المؤسسات والوحدات الفرعية',
    },
    'explorer.institution_level_filter.option.top_level': {
      de: 'Nur Institutionen anzeigen',
        en: 'Show only institutions',
        el: 'Εμφάνιση μόνο των ιδρυμάτων',
        es: 'Mostrar solo las instituciones',
        ru: 'Показать только учреждения',
        uk: 'Показати тільки установи',
        ar: 'عرض المؤسسات فقط',
    },
    'explorer.sub_institutions.one': {
      de: 'Untereinrichtung',
      en: 'Sub-division',
      el: 'Υπο-ίδρυμα',
      es: 'Sub-institución',
      ru: 'Дочернее учреждение',
      uk: 'Підустанова',
      ar: 'المؤسسة الفرعية',
    },
    'explorer.sub_institutions.other': {
      de: 'Untereinrichtungen',
      en: 'Sub-institutions',
      el: 'Υπο-ιδρύματα',
      es: 'Sub-instituciones',
      ru: 'Дочерние учреждения',
      uk: 'Підустанови',
      ar: 'المؤسسات الفرعية',
    },
  }.freeze

  OLD_TRANSLATIONS = {
    'explorer.institution_level_filter.option.all': {
        de: 'Alle',
        en: 'All',
        el: 'Όλα',
        es: 'Todos',
        ru: 'Все',
        uk: 'Усі',
        ar: 'الكل',
    },
    'explorer.institution_level_filter.option.top_level': {
      de: 'Institutionen',
        en: 'Institutions',
        el: 'Ίδρυματα',
        es: 'Instituciones',
        ru: 'Учреждения',
        uk: 'Установи',
        ar: 'المؤسسات',
    },
    'explorer.sub_institutions.one': {
      de: 'Untereinrichtung',
      en: 'Sub-institution',
      el: 'Υπο-ίδρυμα',
      es: 'Sub-institución',
      ru: 'Дочернее учреждение',
      uk: 'Підустанова',
      ar: 'المؤسسة الفرعية',
    },
    'explorer.sub_institutions.other': {
      de: 'Untereinrichtungen',
      en: 'Sub-institutions',
      el: 'Υπο-ιδρύματα',
      es: 'Sub-instituciones',
      ru: 'Дочерние учреждения',
      uk: 'Підустанови',
      ar: 'المؤسسات الفرعية',
    },
  }.freeze

  REMOVED_TRANSLATIONS = {
        'explorer.institution_level_filter.option.with_parent': {
      de: 'Untereinrichtung',
        en: 'Sub-units',
        el: 'Υπομονάδες',
        es: 'Subunidades',
        ru: 'Подразделения',
        uk: 'Підрозділи',
        ar: 'الوحدات الفرعية',
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
