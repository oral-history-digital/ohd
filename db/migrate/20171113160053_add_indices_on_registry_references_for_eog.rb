class AddIndicesOnRegistryReferencesForEog < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :mog
      add_index :registry_references, [:ref_object_type, :ref_object_id]
      add_index :registry_references, :ref_object_type
      add_index :registry_references, :ref_object_id
      add_index :registry_references, :registry_entry_id
    end
  end
end
