class AddColumnNameToPermissions < ActiveRecord::Migration[5.2]
  def change
    add_column :permissions, :name, :string
  end
end
