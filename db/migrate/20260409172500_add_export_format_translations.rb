class AddExportFormatTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.export_formats.label': {
        de: 'Exportformate (Transkripte)',
        en: 'Export formats (Transcripts)',
        el: 'Μορφές εξαγωγής (Μεταγραφές)',
        es: 'Formatos de exportación (Transcripciones)',
        ru: 'Форматы экспорта (Транскрипты)',
        uk: 'Формати експорту (Транскрипти)',
        ar: 'تنسيقات التصدير (النصوص)',
    },
    'explorer.export_formats.description': {
        de: 'PDF, CSV (auf Anfrage), TEI-XML (auf Anfrage)',
        en: 'PDF, CSV (on request), TEI-XML (on request)',
        el: 'PDF, CSV (κατόπιν αιτήματος), TEI-XML (κατόπιν αιτήματος)',
        es: 'PDF, CSV (a solicitud), TEI-XML (a solicitud)',
        ru: 'PDF, CSV (по запросу), TEI-XML (по запросу)',
        uk: 'PDF, CSV (на запит), TEI-XML (на запит)',
        ar: 'PDF، CSV (عند الطلب)، TEI-XML (عند الطلب)',
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
