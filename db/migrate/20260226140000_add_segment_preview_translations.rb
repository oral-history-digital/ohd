class AddSegmentPreviewTranslations < ActiveRecord::Migration[8.0]
    TRANSLATIONS = {
    'edit.segment.preview_play': {
        de: 'Segment abspielen',
        en: 'Play segment',
        el: 'Αναπαραγωγή τμήματος',
        es: 'Reproducir segmento',
        ru: 'Воспроизвести сегмент',
        uk: 'Відтворити сегмент',
        ar: 'تشغيل المقطع',
    },
    'edit.segment.preview_stop': {
        de: 'Wiedergabe stoppen',
        en: 'Stop playback',
        el: 'Διακοπή αναπαραγωγής',
        es: 'Detener reproducción',
        ru: 'Остановить воспроизведение',
        uk: 'Зупинити відтворення',
        ar: 'إيقاف التشغيل',
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
