class AddIndexes < ActiveRecord::Migration[7.0]
  def change
    add_index :interviews, :workflow_state
    add_index :metadata_fields, [:ref_object_type, :use_in_map_search]
    add_index :registry_references, :registry_entry_id
    add_index :registry_references, :ref_object_id
    add_index :registry_references, :ref_object_type
    add_index :registry_references, :interview_id
  end
end
