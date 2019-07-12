class CreateRegistryEntryProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :registry_entry_projects do |t|
      t.integer :project_id
      t.integer :registry_entry_id

      t.timestamps
    end
  end
end
