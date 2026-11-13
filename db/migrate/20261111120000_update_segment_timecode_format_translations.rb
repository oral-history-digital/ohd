# Updates the segment editor translations to require milliseconds.
class UpdateSegmentTimecodeFormatTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'edit.segment.timecode_format' => {
      de: 'Format: HH:MM:SS.mmm',
      en: 'Format: HH:MM:SS.mmm',
      el: 'Μορφή: HH:MM:SS.mmm',
      es: 'Formato: HH:MM:SS.mmm',
      ru: 'Формат: HH:MM:SS.mmm',
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_format' => {
      de: 'Ungültiges Format. Erwartet: HH:MM:SS.mmm',
      en: 'Invalid format. Expected: HH:MM:SS.mmm',
      el: 'Μη έγκυρη μορφή. Αναμενόμενη: HH:MM:SS.mmm',
      es: 'Formato no válido. Se espera: HH:MM:SS.mmm',
      ru: 'Неверный формат. Ожидается: HH:MM:SS.mmm',
    }
  }.freeze

  PREVIOUS_TRANSLATIONS = {
    'edit.segment.timecode_format' => {
      de: 'Format: HH:MM:SS oder HH:MM:SS.mmm',
      en: 'Format: HH:MM:SS or HH:MM:SS.mmm',
      el: 'Μορφή: HH:MM:SS ή HH:MM:SS.mmm',
      es: 'Formato: HH:MM:SS o HH:MM:SS.mmm',
      ru: 'Формат: HH:MM:SS или HH:MM:SS.mmm',
    },
    'edit.segment.timecode_format_frames' => {
      de: 'Format: HH:MM:SS oder HH:MM:SS.ff (25 fps)',
      en: 'Format: HH:MM:SS or HH:MM:SS.ff (25 fps)',
      el: 'Μορφή: HH:MM:SS ή HH:MM:SS.ff (25 fps)',
      es: 'Formato: HH:MM:SS o HH:MM:SS.ff (25 fps)',
      ru: 'Формат: HH:MM:SS или HH:MM:SS.ff (25 fps)',
      uk: 'Формат: HH:MM:SS або HH:MM:SS.ff (25 fps)',
      ar: 'التنسيق: HH:MM:SS أو HH:MM:SS.ff (25 إطار/ث)'
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_format' => {
      de: 'Ungültiges Format. Erwartet: HH:MM:SS oder HH:MM:SS.mmm',
      en: 'Invalid format. Expected: HH:MM:SS or HH:MM:SS.mmm',
      el: 'Μη έγκυρη μορφή. Αναμενόμενη: HH:MM:SS ή HH:MM:SS.mmm',
      es: 'Formato inválido. Esperado: HH:MM:SS o HH:MM:SS.mmm',
      ru: 'Неверный формат. Ожидается: HH:MM:SS или HH:MM:SS.mmm',
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_format_frames' => {
      de: 'Ungültiges Format. Erwartet: HH:MM:SS oder HH:MM:SS.ff (25 fps)',
      en: 'Invalid format. Expected: HH:MM:SS or HH:MM:SS.ff (25 fps)',
      el: 'Μη έγκυρη μορφή. Αναμενόμενη: HH:MM:SS ή HH:MM:SS.ff (25 fps)',
      es: 'Formato no válido. Se espera: HH:MM:SS o HH:MM:SS.ff (25 fps)',
      ru: 'Неверный формат. Ожидается: HH:MM:SS или HH:MM:SS.ff (25 fps)',
      uk: 'Невірний формат. Очікується: HH:MM:SS або HH:MM:SS.ff (25 fps)',
      ar: 'تنسيق غير صالح. المتوقع: HH:MM:SS أو HH:MM:SS.ff (25 إطار/ث)'
    },
  }.freeze

  FRAME_FORMAT_KEYS = %w[
    edit.segment.timecode_format_frames
    activerecord.errors.models.segment.attributes.timecode.invalid_format_frames
  ].freeze

  # Updates existing format messages and removes unused frame messages.
  # @return [void]
  def up
    store_translations(TRANSLATIONS)
    TranslationValue.where(key: FRAME_FORMAT_KEYS).destroy_all
  end

  # Restores the previous format messages from their original migration values.
  # @return [void]
  def down
    store_translations(PREVIOUS_TRANSLATIONS)
  end

  private

  # Saves each localized value, raising if any write fails.
  #
  # @param entries [Hash{String => Hash{Symbol => String}}] Text by translation key and locale
  # @return [void]
  def store_translations(entries)
    entries.each do |key, translations|
      value = TranslationValue.find_or_create_by!(key: key)
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale.to_s).update!(value: text)
      end
    end
  end
end
