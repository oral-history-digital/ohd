class AddNotesTranslationValues < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'metadata_labels.notes': {
      de: 'Hinweis',
      en: 'Note',
      el: 'Σημείωση',
      es: 'Nota',
      ru: 'Примечание',
      uk: 'Примітка',
      ar: 'ملاحظة',
    },
    'search_facets.notes': {
      de: 'Hinweis',
      en: 'Note',
      el: 'Σημείωση',
      es: 'Nota',
      ru: 'Примечание',
      uk: 'Примітка',
      ar: 'ملاحظة',
    },
    'activerecord.attributes.interview.notes': {
      de: 'Hinweis',
      en: 'Note',
      el: 'Σημείωση',
      es: 'Nota',
      ru: 'Примечание',
      uk: 'Примітка',
      ar: 'ملاحظة',
    },
    'activerecord.attributes.interview.include_notes_in_transcript_pdf': {
      de: 'Hinweis im Transkript-PDF anzeigen',
      en: 'Show note in the transcript PDF',
      el: 'Εμφάνιση σημείωσης στο PDF απομαγνητοφώνησης',
      es: 'Mostrar nota en el PDF de la transcripción',
      ru: 'Показать примечание в PDF расшифровки',
      uk: 'Показати примітку в PDF розшифровки',
      ar: 'عرض الملاحظة في ملف PDF للتفريغ النصي',
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
