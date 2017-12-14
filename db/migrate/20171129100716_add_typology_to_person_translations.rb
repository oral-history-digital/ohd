class AddTypologyToPersonTranslations < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :mog
      add_column :person_translations, :typology, :string
    end
  end
end
