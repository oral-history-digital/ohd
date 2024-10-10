class AddIndexesToRegistryReferences < ActiveRecord::Migration[7.0]
  def change
    add_index :registry_references, :registry_entry_id
    add_index :registry_references, :interview_id
  end
end
