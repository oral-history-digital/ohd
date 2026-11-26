# frozen_string_literal: true

# Adds transcript tape-selection labels and feedback to runtime translations.
class AddTranscriptTapeSelectionTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'no_tapes' => {
      en: 'Add a tape to this interview before importing a transcript.',
      de: 'Fügen Sie diesem Interview vor dem Transkriptimport ein Band hinzu.'
    },
    'loading_tapes' => { en: 'Loading tapes…', de: 'Bänder werden geladen…' },
    'starting_tape' => { en: 'Starting tape', de: 'Startband' },
    'starting_tape_help' => {
      en: 'Timing entries apply to this tape and the following tapes, in order.',
      de: 'Die Zeitangaben gelten der Reihe nach für dieses Band und die folgenden Bänder.'
    }
  }.freeze

  # Stores labels in the runtime translation database.
  # @return [void]
  def up
    TRANSLATIONS.each do |code, translations|
      value = TranslationValue.find_or_create_by!(key: "transcript_import.#{code}")
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale).update!(value: text)
      end
    end
  end

  # Removes only the keys introduced by this migration.
  # @return [void]
  def down
    TranslationValue.where(key: TRANSLATIONS.keys.map { |code| "transcript_import.#{code}" }).destroy_all
  end
end
