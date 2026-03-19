class AddExplorerCollectionSortTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.sort.collection_name_asc': {
      de: 'Name (A-Z)',
      en: 'Name (A-Z)',
      el: 'Όνομα (Α-Ω)',
      es: 'Nombre (A-Z)',
      ru: 'Название (А-Я)',
      uk: 'Назва (А-Я)',
      ar: 'الاسم (أ-ي)',
    },
    'explorer.sort.collection_name_desc': {
      de: 'Name (Z-A)',
      en: 'Name (Z-A)',
      el: 'Όνομα (Ω-Α)',
      es: 'Nombre (Z-A)',
      ru: 'Название (Я-А)',
      uk: 'Назва (Я-А)',
      ar: 'الاسم (ي-أ)',
    },
    'explorer.sort.collection_interviews_desc': {
      de: 'Zahl der Interviews (absteigend)',
      en: 'Number of Interviews (descending)',
      el: 'Αριθμός συνεντεύξεων (φθίνουσα)',
      es: 'Número de entrevistas (descendente)',
      ru: 'Количество интервью (по убыванию)',
      uk: "Кількість інтерв'ю (за спаданням)",
      ar: 'عدد المقابلات (تنازلي)',
    },
    'explorer.sort.collection_interviews_asc': {
      de: 'Zahl der Interviews (aufsteigend)',
      en: 'Number of Interviews (ascending)',
      el: 'Αριθμός συνεντεύξεων (αύξουσα)',
      es: 'Número de entrevistas (ascendente)',
      ru: 'Количество интервью (по возрастанию)',
      uk: "Кількість інтерв'ю (за зростанням)",
      ar: 'عدد المقابلات (تصاعدي)',
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
