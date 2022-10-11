class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.date :start_date, null: false
      t.date :end_date
      t.belongs_to :event_type, null: false, index: true
      t.belongs_to :eventable, polymorphic: true, null: false, index: true

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Event.create_translation_table!(display_date: :string)
      end

      dir.down do
        Event.drop_translation_table!
      end
    end
  end
end
