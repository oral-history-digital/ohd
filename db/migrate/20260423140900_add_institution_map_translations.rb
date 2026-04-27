class AddInstitutionMapTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.institutions_list.expand_map': {
      de: 'Karte größer anzeigen',
      en: 'Enlarge map',
      el: 'Μεγέθυνση χάρτη',
      es: 'Ampliar mapa',
      ru: 'Увеличить карту',
      uk: 'Збільшити карту',
      ar: 'تكبير الخريطة',
    },
    'explorer.institutions_list.collapse_map': {
      de: 'Karte kleiner anzeigen',
      en: 'Reduce map',
      el: 'Σμίκρυνση χάρτη',
      es: 'Reducir mapa',
      ru: 'Уменьшить карту',
      uk: 'Зменшити карту',
      ar: 'تصغير الخريطة',
    },
    'explorer.institutions_list.description': {
      de: 'Oral-History.Digital verzeichnet Interviews aus %{count} Institutionen (Universitäten, Stiftungen, Museen oder Vereinen) und deren Einrichtungen (Institute, Gedenkstätten oder Bibliotheken).',
      en: 'Oral-History.Digital provides access to interviews held by %{count} institutions (universities, foundations, museums, or associations) and their affiliated entities (institutes, memorial sites, or libraries).',
      el: 'Το Oral-History.Digital καταγράφει συνεντεύξεις από %{count} ιδρύματα (πανεπιστήμια, ιδρύματα, μουσεία ή ενώσεις) και τους επιμέρους φορείς τους (ινστιτούτα, μνημειακούς χώρους ή βιβλιοθήκες).',
      es: 'Oral-History.Digital ofrece acceso a entrevistas de %{count} instituciones (universidades, fundaciones, museos o asociaciones) y sus entidades asociadas (institutos, sitios conmemorativos o bibliotecas).',
      ru: 'Oral-History.Digital содержит интервью из %{count} учреждений (университеты, фонды, музеи или ассоциации) и их подразделений (институты, мемориальные места или библиотеки).',
      uk: 'Oral-History.Digital містить інтерв’ю з %{count} установ (університети, фонди, музеї або асоціації) та їхніх підрозділів (інститути, меморіальні місця або бібліотеки).',
      ar: 'يوفّر Oral-History.Digital مقابلات من %{count} مؤسسة (جامعات، مؤسسات، متاحف أو جمعيات) والجهات التابعة لها (معاهد، مواقع تذكارية أو مكتبات).',
    }
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
