class AddTimestampsToRegistryNameTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :registry_name_types, :updated_at, :datetime
    add_column :registry_name_types, :created_at, :datetime
  end
end
