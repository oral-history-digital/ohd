class AddProjectIdToRoles < ActiveRecord::Migration[5.2]
  def up
    add_column :roles, :project_id, :integer
    Role.all.update_all project_id: Project.first.id
  end
  def down
    remove_column :roles, :project_id
  end
end
