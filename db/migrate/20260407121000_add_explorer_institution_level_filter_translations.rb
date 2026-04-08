class AddExplorerInstitutionLevelFilterTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.institution_level_filter.label': {
        de: 'Nach Hierarchie anzeigen',
        en: 'Filter by hierarchy',
        el: 'Φιλτράρισμα κατά ιεραρχία',
        es: 'Filtrar por jerarquía',
        ru: 'Фильтр по иерархии',
        uk: 'Фільтр за ієрархією',
        ar: 'التصفية حسب التسلسل الهرمي',
    },
    'explorer.institution_level_filter.option.all': {
        de: 'Alle',
        en: 'All',
        el: 'Όλα',
        es: 'Todos',
        ru: 'Все',
        uk: 'Усі',
        ar: 'الكل',
    },
    'explorer.institution_level_filter.option.with_children': {
        de: 'Institutionen mit Untereinrichtungen',
        en: 'Institutions with sub-units',
        el: 'Ιδρύματα με υπομονάδες',
        es: 'Instituciones con subunidades',
        ru: 'Учреждения с подразделениями',
        uk: 'Установи з підрозділами',
        ar: 'المؤسسات التي لديها وحدات فرعية',
    },
    'explorer.institution_level_filter.option.with_parent': {
        de: 'Nur Untereinrichtungen',
        en: 'Only sub-units',
        el: 'Μόνο υπομονάδες',
        es: 'Solo subunidades',
        ru: 'Только подразделения',
        uk: 'Лише підрозділи',
        ar: 'الوحدات الفرعية فقط',
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
