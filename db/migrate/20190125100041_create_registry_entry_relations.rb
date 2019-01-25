class CreateRegistryEntryRelations < ActiveRecord::Migration[5.2]
  def change
    create_table :registry_entry_relations do |t|
      t.integer :registry_entry_id
      t.integer :related_id

      t.timestamps
    end
  end
end
