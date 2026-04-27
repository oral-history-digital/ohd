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
    'edit.segment.preview_pause': {
        de: 'Wiedergabe pausieren',
        en: 'Pause playback',
        el: 'Παύση αναπαραγωγής',
        es: 'Pausar reproducción',
        ru: 'Приостановить воспроизведение',
        uk: 'Призупинити відтворення',
        ar: 'إيقاف مؤقت',
    },
    'edit.segment.preview_restart': {
        de: 'Zum Segmentanfang springen',
        en: 'Jump to segment start',
        el: 'Μετάβαση στην αρχή του τμήματος',
        es: 'Ir al inicio del segmento',
        ru: 'Перейти к началу сегмента',
        uk: 'Перейти до початку сегмента',
        ar: 'الانتقال إلى بداية المقطع',
    },
    'edit.segment.preview_back_3': {
        de: '3 Sekunden zurück',
        en: '3 seconds back',
        el: '3 δευτερόλεπτα πίσω',
        es: '3 segundos atrás',
        ru: '3 секунд назад',
        uk: '3 секунд назад',
        ar: '3 ثوانٍ للخلف',
    },
    'edit.segment.preview_forward_3': {
        de: '3 Sekunden vor',
        en: '3 seconds forward',
        el: '3 δευτερόλεπτα μπροστά',
        es: '3 segundos adelante',
        ru: '3 секунд вперёд',
        uk: '3 секунд вперед',
        ar: '3 ثوانٍ للأمام',
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
