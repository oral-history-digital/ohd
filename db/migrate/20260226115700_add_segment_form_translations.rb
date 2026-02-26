class AddSegmentFormTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'edit.segment.tab_edit': {
      de: 'Bearbeiten',
      en: 'Edit',
      el: 'Επεξεργασία',
      es: 'Editar',
      ru: 'Редактировать'
    },
    'edit.segment.tab_annotations': {
      de: 'Anmerkungen',
      en: 'Annotations',
      el: 'Σημειώσεις',
      es: 'Anotaciones',
      ru: 'Аннотации'
    },
    'edit.segment.tab_registry_references': {
      de: 'Verknüpfungen',
      en: 'References',
      el: 'Αναφορές',
      es: 'Referencias',
      ru: 'Ссылки'
    },
    'edit.segment.text': {
      de: 'Text',
      en: 'Text',
      el: 'Κείμενο',
      es: 'Texto',
      ru: 'Текст',
    },
    'edit.segment.speaker': {
      de: 'Sprecher*in',
      en: 'Speaker',
      el: 'Ομιλητής',
      es: 'Hablante',
      ru: 'Говорящий',
    },
    'edit.segment.timecode': {
      de: 'Start-Timecode',
      en: 'Start Timecode',
      el: 'Χρονικός κώδικας έναρξης',
      es: 'Código de tiempo de inicio',
      ru: 'Начальный таймкод',
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_timecode_range': {
      de: 'Timecode muss zwischen den Timecodes des vorherigen und nächsten Segments liegen',
      en: 'Timecode must be between the previous and next segment timecodes',
      el: 'Ο χρονικός κώδικας πρέπει να βρίσκεται μεταξύ των χρονικών κωδικών του προηγούμενου και του επόμενου τμήματος',
      es: 'El código de tiempo debe estar entre los códigos de tiempo del segmento anterior y siguiente',
      ru: 'Таймкод должен находиться между таймкодами предыдущего и следующего сегментов',
    },
    'activerecord.errors.models.segment.attributes.timecode.invalid_format': {
      de: 'Ungültiges Format. Erwartet: HH:MM:SS oder HH:MM:SS.mmm',
      en: 'Invalid format. Expected: HH:MM:SS or HH:MM:SS.mmm',
      el: 'Μη έγκυρη μορφή. Αναμενόμενη: HH:MM:SS ή HH:MM:SS.mmm',
      es: 'Formato inválido. Esperado: HH:MM:SS o HH:MM:SS.mmm',
      ru: 'Неверный формат. Ожидается: HH:MM:SS или HH:MM:SS.mmm',
    },
    'edit.segment.timecode_range_both': {
      de: 'Erlaubt: %{prev} bis %{next}',
      en: 'Allowed: %{prev} to %{next}',
      el: 'Επιτρέπεται: %{prev} έως %{next}',
      es: 'Permitido: %{prev} a %{next}',
      ru: 'Допускается: %{prev} до %{next}',
    },
    'edit.segment.timecode_range_prev_only': {
      de: 'Erlaubt: > %{prev}',
      en: 'Allowed: > %{prev}',
      el: 'Επιτρέπεται: > %{prev}',
      es: 'Permitido: > %{prev}',
      ru: 'Допускается: > %{prev}',
    },
    'edit.segment.timecode_format': {
      de: 'Format: HH:MM:SS oder HH:MM:SS.mmm',
      en: 'Format: HH:MM:SS or HH:MM:SS.mmm',
      el: 'Μορφή: HH:MM:SS ή HH:MM:SS.mmm',
      es: 'Formato: HH:MM:SS o HH:MM:SS.mmm',
      ru: 'Формат: HH:MM:SS или HH:MM:SS.mmm',
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
