# frozen_string_literal: true

# Adds feedback for synchronous transcript import checks.
class AddImportPrecheckUiTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'checking' => [
      'Checking the file and import settings…',
      'Datei und Importeinstellungen werden geprüft…'
    ],
    'invalid' => [
      'Please correct the following issues before importing.',
      'Bitte beheben Sie vor dem Import die folgenden Fehler.'
    ],
    'error' => [
      'The check could not be completed. Please try again.',
      'Die Prüfung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.'
    ],
    'queued' => [
      'Your import is queued.',
      'Ihr Import wurde zur Verarbeitung eingereicht.'
    ],
    'queued_hint' => [
      'The file will be validated again during processing. You will receive an email when processing finishes, including any errors.',
      'Die Datei wird während der Verarbeitung erneut geprüft. Sie erhalten nach Abschluss eine E-Mail, gegebenenfalls mit Fehlermeldungen.'
    ],
    'import_failed' => [
      'The import could not be started. Please try again.',
      'Der Import konnte nicht gestartet werden. Bitte versuchen Sie es erneut.'
    ]
  }.freeze

  # Stores UI feedback in the runtime translation database.
  # @return [void]
  def up
    TRANSLATIONS.each do |code, texts|
      value = TranslationValue.find_or_create_by!(key: "import_validation.#{code}")
      %w[en de].zip(texts).each do |locale, text|
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
