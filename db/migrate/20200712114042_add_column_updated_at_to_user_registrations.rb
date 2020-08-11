class AddColumnUpdatedAtToUserRegistrations < ActiveRecord::Migration[5.2]
  def change
    add_column :user_registrations, :updated_at, :datetime
  end
end
