class MvTypologyFromPersonTranslationsToPeople < ActiveRecord::Migration[5.0]
  def change
    remove_column :person_translations, :typology
    add_column :people, :typology, :string
  end
end
