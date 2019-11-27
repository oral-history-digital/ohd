class AddChildrenOnlyToRegistryReferenceTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :registry_reference_types, :children_only, :boolean, default: false
  end
end
