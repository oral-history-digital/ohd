class AddExplorerSearchPlaceholderVariants < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.search_placeholder.archives': {
      de: 'Archive & Sammlungen durchsuchen…',
      en: 'Search archives & collections…',
      el: 'Αναζήτηση αρχείων & συλλογών…',
      es: 'Buscar archivos y colecciones…',
      ru: 'Поиск архивов и коллекций…',
      uk: 'Пошук архівів і колекцій…',
      ar: 'البحث في الأرشيفات والمجموعات…',
    },
    'explorer.search_placeholder.institutions': {
      de: 'Institutionen durchsuchen…',
      en: 'Search institutions…',
      el: 'Αναζήτηση ιδρυμάτων…',
      es: 'Buscar instituciones…',
      ru: 'Поиск учреждений…',
      uk: 'Пошук установ…',
      ar: 'البحث في المؤسسات…',
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
