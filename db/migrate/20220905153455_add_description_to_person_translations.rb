class AddDescriptionToPersonTranslations < ActiveRecord::Migration[5.2]
  def change
    add_column :person_translations, :description, :text
  end
end
