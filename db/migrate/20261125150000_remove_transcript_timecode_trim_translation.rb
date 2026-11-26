# frozen_string_literal: true

# Removes the obsolete label now that spreadsheet imports always trim timecodes.
class RemoveTranscriptTimecodeTrimTranslation < ActiveRecord::Migration[8.1]
  KEY = 'activerecord.attributes.transcript.trim_timecodes'

  # Removes the unused runtime label and its translations.
  # @return [void]
  def up
    TranslationValue.find_by(key: KEY)&.destroy!
  end

  # Restores the original label if the trim option is reintroduced by rollback.
  # @return [void]
  def down
    value = TranslationValue.find_or_create_by!(key: KEY)
    {
      de: 'Leerzeichen am Anfang und Ende von Timecodes entfernen',
      en: 'Trim whitespace around timecodes'
    }.each do |locale, text|
      value.translations.find_or_initialize_by(locale: locale).update!(value: text)
    end
  end
end
