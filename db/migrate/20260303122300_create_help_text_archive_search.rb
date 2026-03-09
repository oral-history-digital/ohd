class CreateHelpTextArchiveSearch < ActiveRecord::Migration[8.0]
  def up
    help_texts = [
      {
        code: 'archive_search_page',
        description: 'Search page archive',
        translations: {
          de: { url: 'https://www.oral-history.digital/hilfe/ohd_tutorial_suche_einzelarchiv/index.html' },
          en: { url: 'https://www.oral-history.digital/en/hilfe/ohd_tutorial_suche_einzelarchiv/index.html' },
        }
      },
    ]

    help_texts.each do |ht_data|
      ht = HelpText.find_or_create_by(code: ht_data[:code]) do |ht|
        ht.description = ht_data[:description]
      end

      ht_data[:translations].each do |locale, translation|
        ht.translations.find_or_initialize_by(locale: locale.to_s).update(
          text: translation[:text],
          url: translation[:url]
        )
      end
    end
  end

  def down
    HelpText.where(code: ['archive_search_page']).destroy_all
  end
end
