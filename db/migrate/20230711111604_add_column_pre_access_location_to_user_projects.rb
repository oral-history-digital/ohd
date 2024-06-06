class AddColumnPreAccessLocationToUserProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :user_projects, :pre_access_location, :string
  end
end
