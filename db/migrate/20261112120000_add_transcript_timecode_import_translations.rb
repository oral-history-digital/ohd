# Adds labels for the spreadsheet timecode import options.
class AddTranscriptTimecodeImportTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'activerecord.attributes.transcript.use_frame_timecodes' => {
      de: 'Timecodes mit Frame-Nummern verwenden',
      en: 'Use frame timecodes'
    },
    'activerecord.attributes.transcript.timecode_frame_rate' => {
      de: 'Bildrate der Quelldatei (fps)',
      en: 'Source frame rate (fps)'
    },
    'activerecord.attributes.transcript.timecode_frame_rate_explanation' => {
      de: 'Für HH:MM:SS:FF aktivieren und die Bildrate der Quelle auswählen. Für HH:MM:SS.mmm deaktiviert lassen.',
      en: 'For HH:MM:SS:FF, enable this option and select the source frame rate. For HH:MM:SS.mmm, leave it unchecked.'
    },
    'activerecord.attributes.transcript.trim_timecodes' => {
      de: 'Leerzeichen am Anfang und Ende von Timecodes entfernen',
      en: 'Trim whitespace around timecodes'
    }
  }.freeze

  # @return [void]
  def up
    TRANSLATIONS.each do |key, translations|
      value = TranslationValue.find_or_create_by!(key: key)
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale.to_s).update!(value: text)
      end
    end
  end

  # @return [void]
  def down
    TranslationValue.where(key: TRANSLATIONS.keys).destroy_all
  end
end
