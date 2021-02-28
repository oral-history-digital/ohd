class RemoveColumnRegistryEntryIdFromMetadataFields < ActiveRecord::Migration[5.2]
  def change
    remove_column :metadata_fields, :registry_entry_id, :integer
  end
end
