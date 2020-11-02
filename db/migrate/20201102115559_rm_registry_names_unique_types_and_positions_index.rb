class RmRegistryNamesUniqueTypesAndPositionsIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index :registry_names, :name => 'registry_names_unique_types_and_positions'
  end
end
