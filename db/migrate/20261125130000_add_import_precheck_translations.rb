# frozen_string_literal: true

# Adds runtime messages for pre-check request settings.
class AddImportPrecheckTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'language.not_assigned' => {
      en: 'Choose a language assigned to this interview.',
      de: 'Wählen Sie eine Sprache, die diesem Interview zugeordnet ist.'
    },
    'file.unsupported_format' => {
      en: 'Upload a transcript spreadsheet, VTT, SRT, or ODT file.',
      de: 'Laden Sie eine Transkripttabelle oder eine VTT-, SRT- oder ODT-Datei hoch.'
    },
    'file.invalid_structure' => {
      en: 'The table could not be read. Check its file format and required column headings.',
      de: 'Die Tabelle konnte nicht gelesen werden. Prüfen Sie das Dateiformat und die erforderlichen Spaltenüberschriften.'
    }
  }.freeze

  # Stores pre-check diagnostics in the runtime translation database.
  # @return [void]
  def up
    TRANSLATIONS.each do |code, translations|
      value = TranslationValue.find_or_create_by!(key: "import_validation.#{code}")
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale).update!(value: text)
      end
    end
  end

  # Removes only the keys introduced by this migration.
  # @return [void]
  def down
    TranslationValue.where(key: TRANSLATIONS.keys.map { |code| "import_validation.#{code}" }).destroy_all
  end
end
