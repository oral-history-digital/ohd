class AddTypologyToPersonTranslations < ActiveRecord::Migration[5.0]
  def change
    add_column :person_translations, :typology, :string
  end
end
