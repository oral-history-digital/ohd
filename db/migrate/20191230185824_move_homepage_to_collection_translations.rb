class MoveHomepageToCollectionTranslations < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        rename_column :collections, :homepage, :homepage_old
        Collection.add_translation_fields! homepage: :string
        Collection.all.each do |c|
          c.update_attributes locale: I18n.default_locale, homepage: c.homepage_old
        end
        remove_column :collections, :homepage_old
      end

      dir.down do
        add_column :collections, :homepage_old
        Collection.all.each do |c|
          c.update_attributes homepage_old: c.homepage(I18n.default_locale)
        end
        remove_column :collection_translations, :homepage
        rename_column :collections, :homepage_old, :homepage
      end
    end
  end
end
