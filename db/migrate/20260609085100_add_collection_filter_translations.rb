class AddCollectionFilterTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.collection_list.hidden_by_filter': {
      de: 'durch Filter ausgeblendet',
      en: 'hidden by filter',
      el: 'κρυφό λόγω φίλτρου',
      es: 'oculto por filtro',
      ru: 'скрыто фильтром',
      uk: 'приховано фільтром',
      ar: 'مخفي بسبب التصفية',
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
