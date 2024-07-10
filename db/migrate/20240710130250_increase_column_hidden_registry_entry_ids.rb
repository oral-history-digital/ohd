class IncreaseColumnHiddenRegistryEntryIds < ActiveRecord::Migration[7.0]
  def change
    change_column :projects, :hidden_registry_entry_ids, :text
  end
end
