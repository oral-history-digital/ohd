class AddTypologyToPersonTranslations < ActiveRecord::Migration[5.0]
  unless Project.name.to_sym == :mog
    def change
      add_column :person_translations, :typology, :string
    end
  end
end
