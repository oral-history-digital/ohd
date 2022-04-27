class AddLoggedOutVisibleRegistryEntryIdsToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :logged_out_visible_registry_entry_ids, :string
  end
end
