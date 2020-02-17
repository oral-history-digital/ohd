class TranslateExternalLinkNames < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|

      dir.up do

        # get translations from locale files 
        external_links = ActiveRecord::Base.connection.exec_query("SELECT * FROM external_links").entries
        translations = external_links.inject({}) do |mem, link|
          mem[link["id"]] = I18n.available_locales.inject({}) do |mem2, locale|
              mem2[locale] = I18n.t(link["name"], locale: locale)
              mem2
          end
          mem
        end

      # create translation table
        ExternalLink.add_translation_fields! name: :string
        
        # write translations back to ExternalLinkTranslations
        ExternalLink.find_each do |link|
          I18n.available_locales.each do |locale|
            link.attributes = {name: translations[link.id][locale], locale: locale}
            link.save
          end
        end

        Project.all.map(&:touch)

      end


      dir.down do
        remove_column :external_link_translations, :name
        Project.all.map(&:touch)
      end
    end
  end
end
