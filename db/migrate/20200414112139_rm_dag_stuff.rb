class RmDagStuff < ActiveRecord::Migration[5.2]
  def change
    RegistryHierarchy.where(direct: false).destroy_all
    remove_column :registry_hierarchies, :direct
    remove_column :registry_hierarchies, :count
  end
end
