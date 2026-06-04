class AddDateFieldHelpTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'help_texts.date_field': {
      de: 'Formate TT.MM.JJJJ, JJJJ-MM-TT und MM/TT/JJJJ werden als Datum erkannt. Andere Eingaben werden als Text behandelt.',
      en: 'Formats DD.MM.YYYY, YYYY-MM-DD, and MM/DD/YYYY are recognized as dates. Other entries are treated as text.',
      el: 'Οι μορφές ΗΗ.ΜΜ.ΕΕΕΕ, ΕΕΕΕ-ΜΜ-ΗΗ και ΜΜ/ΗΗ/ΕΕΕΕ αναγνωρίζονται ως ημερομηνίες. Άλλες καταχωρίσεις αντιμετωπίζονται ως κείμενο.',
      es: 'Los formatos DD.MM.AAAA, AAAA-MM-DD y MM/DD/AAAA se reconocen como fechas. Otras entradas se tratan como texto.',
      ru: 'Форматы ДД.ММ.ГГГГ, ГГГГ-ММ-ДД и ММ/ДД/ГГГГ распознаются как даты. Другие значения обрабатываются как текст.',
      uk: 'Формати ДД.ММ.РРРР, РРРР-ММ-ДД і ММ/ДД/РРРР розпізнаються як дати. Інші значення обробляються як текст.',
      ar: 'تُعرَف التنسيقات DD.MM.YYYY و YYYY-MM-DD و MM/DD/YYYY كتواريخ. وتُعامَل الإدخالات الأخرى كنص.',
    },
  }.freeze
  

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

