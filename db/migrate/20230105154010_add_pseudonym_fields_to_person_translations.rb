class AddPseudonymFieldsToPersonTranslations < ActiveRecord::Migration[5.2]
  def change
    add_column :person_translations, :pseudonym_first_name, :string,
      null: false, default: ''
    add_column :person_translations, :pseudonym_last_name, :string,
      null: false, default: ''

    add_column :people, :use_pseudonym, :boolean, null: false, default: false
  end
end
