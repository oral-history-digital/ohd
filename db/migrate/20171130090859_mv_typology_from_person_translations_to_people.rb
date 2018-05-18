class MvTypologyFromPersonTranslationsToPeople < ActiveRecord::Migration[5.0]
  def change
    remove_column :person_translations, :typology, :string
    add_column :people, :typology, :string
  end
end
