class AddTimecodeFramesFormatTranslations < ActiveRecord::Migration[8.0]
    TRANSLATIONS = {
    'edit.segment.timecode_format_frames': {
        de: 'Format: HH:MM:SS oder HH:MM:SS.ff (25 fps)',
        en: 'Format: HH:MM:SS or HH:MM:SS.ff (25 fps)',
        el: 'Μορφή: HH:MM:SS ή HH:MM:SS.ff (25 fps)',
        es: 'Formato: HH:MM:SS o HH:MM:SS.ff (25 fps)',
        ru: 'Формат: HH:MM:SS или HH:MM:SS.ff (25 fps)',
        uk: 'Формат: HH:MM:SS або HH:MM:SS.ff (25 fps)',
        ar: 'التنسيق: HH:MM:SS أو HH:MM:SS.ff (25 إطار/ث)'
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_format_frames': {
        de: 'Ungültiges Format. Erwartet: HH:MM:SS oder HH:MM:SS.ff (25 fps)',
        en: 'Invalid format. Expected: HH:MM:SS or HH:MM:SS.ff (25 fps)',
        el: 'Μη έγκυρη μορφή. Αναμενόμενη: HH:MM:SS ή HH:MM:SS.ff (25 fps)',
        es: 'Formato no válido. Se espera: HH:MM:SS o HH:MM:SS.ff (25 fps)',
        ru: 'Неверный формат. Ожидается: HH:MM:SS или HH:MM:SS.ff (25 fps)',
        uk: 'Невірний формат. Очікується: HH:MM:SS або HH:MM:SS.ff (25 fps)',
        ar: 'تنسيق غير صالح. المتوقع: HH:MM:SS أو HH:MM:SS.ff (25 إطار/ث)'
    },
    }

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
