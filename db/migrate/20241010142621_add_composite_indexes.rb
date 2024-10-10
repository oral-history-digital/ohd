class AddCompositeIndexes < ActiveRecord::Migration[7.0]
  def change
    add_index :metadata_fields, [:ref_object_type, :use_in_map_search]
    add_index :registry_references, [:registry_entry_id, :interview_id]
  end
end
