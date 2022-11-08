class CreateEventTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :event_types do |t|
      t.string :code, null: false
      t.belongs_to :project, null: false, index: true, foreign_key: true

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        EventType.create_translation_table!(name: :string)
      end

      dir.down do
        EventType.drop_translation_table!
      end
    end
  end
end
