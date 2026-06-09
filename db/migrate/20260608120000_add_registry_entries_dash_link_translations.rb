class AddRegistryEntriesDashLinkTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.sidebar.registry_entries_tab_panel.dash_link': {
      de: 'Visuelle Exploration',
      en: 'Visual Exploration',
    },
    'modules.sidebar.registry_entries_tab_panel.dash_link_title': {
      de: 'Mit Hilfe des Oral-History-Topic-Modeling-Dashboard (OHTM-Dashboard) können Sie visuell und explorativ in viele Interviews einsteigen. Bitte beachten Sie, dass nicht alle Interviews im Dashboard verfügbar sind.',
      en: 'Using the Oral History Topic Modeling Dashboard (OHTM Dashboard), you can visually and exploratively browse many interviews. Please note that not all interviews are available in the dashboard.',
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
