class CreatePeople < ActiveRecord::Migration[5.0]
  def change
  unless Project.name.to_sym == :eog
    create_table :people do |t|
      t.string :date_of_birth
      t.string :gender

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Person.create_translation_table!({
          first_name: :string,
          last_name: :string,
          birth_name: :string,
          other_first_names: :string,
          alias_names: :string
        })
      end

      dir.down do
        Person.drop_translation_table! 
      end
    end
  end
  end
end
