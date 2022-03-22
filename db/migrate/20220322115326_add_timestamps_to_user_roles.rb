class AddTimestampsToUserRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :user_roles, :updated_at, :datetime
    add_column :user_roles, :created_at, :datetime
  end
end
