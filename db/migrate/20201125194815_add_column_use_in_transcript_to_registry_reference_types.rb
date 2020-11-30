class AddColumnUseInTranscriptToRegistryReferenceTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :registry_reference_types, :use_in_transcript, :boolean, default: false
  end
end
