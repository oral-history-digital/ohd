class AddColumnHiddenTranscriptRegistryEntryIdsToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :hidden_transcript_registry_entry_ids, :string
  end
end
