class AddProjectIdToRegistryEntries < ActiveRecord::Migration[5.2]
  def up
    add_column :registry_entries, :project_id, :integer
    RegistryEntry.update_all project_id: Project.first.id
    drop_table :registry_entry_projects
  end
  def down
    remove_column :registry_entries, :project_id
    create_table :registry_entry_projects do |t|
      t.integer :project_id
      t.integer :registry_entry_id

      t.timestamps
    end
  end
end
