class CreateHelpTexts < ActiveRecord::Migration[5.2]
  def change
    create_table :help_texts do |t|
      t.string :code, null: false
      t.text :description

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        HelpText.create_translation_table! text: :text, url: :string
      end

      dir.down do
        HelpText.drop_translation_table!
      end
    end
  end
end
