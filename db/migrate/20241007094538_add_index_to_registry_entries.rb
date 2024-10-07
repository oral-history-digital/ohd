class AddIndexToRegistryEntries < ActiveRecord::Migration[7.0]
  def change
    add_index :registry_entries, :project_id
  end
end
