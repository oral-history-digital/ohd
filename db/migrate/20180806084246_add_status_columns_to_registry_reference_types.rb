class AddStatusColumnsToRegistryReferenceTypes < ActiveRecord::Migration[5.0]
  def change
    add_column :registry_reference_types, :created_at, :datetime
    add_column :registry_reference_types, :updated_at, :datetime
  end
end
