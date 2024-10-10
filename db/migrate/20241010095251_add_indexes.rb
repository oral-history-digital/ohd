class AddIndexes < ActiveRecord::Migration[7.0]
  def change
    add_index :registry_entries, :latitude
    add_index :registry_entries, :longitude

    add_index :interviews, :workflow_state

    add_index :metadata_fields, :ref_object_type
    add_index :metadata_fields, :use_in_map_search
  end
end
