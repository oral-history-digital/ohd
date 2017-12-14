class MvTypologyFromPersonTranslationsToPeople < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :mog
      remove_column :person_translations, :typology, :string
      add_column :people, :typology, :string
    end
  end
end
