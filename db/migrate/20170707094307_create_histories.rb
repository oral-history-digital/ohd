class CreateHistories < ActiveRecord::Migration[5.0]
  def change
  unless Project.name.to_sym == :mog
    create_table :histories do |t|
      t.references :person, foreign_key: true

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        History.create_translation_table!({
          forced_labor_details: :text,
          return_date: :string,
          deportation_date: :string,
          punishment: :string,
          liberation_date: :string
        })
      end

      dir.down do
        History.drop_translation_table! 
      end
    end
  end
  end
end
