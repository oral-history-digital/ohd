class CreateTexts < ActiveRecord::Migration[5.2]
  def change
    create_table :texts do |t|
      t.string :name
      t.integer :project_id

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Text.create_translation_table! text: :text
      end

      dir.down do
        Text.drop_translation_table!
      end
    end
  end
end
