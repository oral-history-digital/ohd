class AddExplorerListCountTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.archives_list.count': {
      de: '%{count} Archive',
      en: '%{count} Archives',
      el: '%{count} αρχεία',
      es: '%{count} Archivos',
      ru: '%{count} архивов',
      uk: '%{count} архівів',
      ar: '%{count} أرشيفات',
    },
    'explorer.archives_list.count_with_total': {
      de: '%{count} Archive (von %{total})',
      en: '%{count} Archives (of %{total})',
      el: '%{count} αρχεία (από %{total})',
      es: '%{count} Archivos (de %{total})',
      ru: '%{count} архивов (из %{total})',
      uk: '%{count} архівів (із %{total})',
      ar: '%{count} أرشيفات (من أصل %{total})',
    },
    'explorer.institutions_list.count': {
      de: '%{count} Institutionen',
      en: '%{count} Institutions',
      el: '%{count} ιδρύματα',
      es: '%{count} Instituciones',
      ru: '%{count} учреждений',
      uk: '%{count} установ',
      ar: '%{count} مؤسسات',
    },
    'explorer.institutions_list.count_with_total': {
      de: '%{count} Institutionen (von %{total})',
      en: '%{count} Institutions (of %{total})',
      el: '%{count} ιδρύματα (από %{total})',
      es: '%{count} Instituciones (de %{total})',
      ru: '%{count} учреждений (из %{total})',
      uk: '%{count} установ (із %{total})',
      ar: '%{count} مؤسسات (من أصل %{total})',
    },
    'explorer.institutions_map.and_more': {
      de: '... und %{count} weitere',
      en: '... and %{count} more',
      el: '... και %{count} ακόμα',
      es: '... y %{count} más',
      ru: '... и еще %{count}',
      uk: '... та ще %{count}',
      ar: 'و %{count} أخرى',
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
