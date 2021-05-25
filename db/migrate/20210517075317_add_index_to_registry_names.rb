class AddIndexToRegistryNames < ActiveRecord::Migration[5.2]
  def change
    add_index :registry_names, :registry_entry_id
  end
end
