class AddColumnProjectAccessGrantedInstantlyToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :grant_project_access_instantly, :boolean, default: false
  end
end
