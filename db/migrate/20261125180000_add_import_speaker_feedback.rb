# frozen_string_literal: true

# Adds runtime feedback for optional speaker-label discovery failures.
class AddImportSpeakerFeedback < ActiveRecord::Migration[8.1]
  KEY = 'import_validation.speakers_unavailable'

  # Explains the manual fallback without blocking the final import check.
  # @return [void]
  def up
    value = TranslationValue.find_or_create_by!(key: KEY)
    {
      en: 'Speaker labels could not be read. Enter the speaker designations manually.',
      de: 'Die Sprecher*innen-Kürzel konnten nicht gelesen werden. Tragen Sie sie bitte manuell ein.'
    }.each do |locale, text|
      value.translations.find_or_initialize_by(locale: locale).update!(value: text)
    end
  end

  # Removes only the feedback key introduced here.
  # @return [void]
  def down
    TranslationValue.find_by(key: KEY)&.destroy!
  end
end
