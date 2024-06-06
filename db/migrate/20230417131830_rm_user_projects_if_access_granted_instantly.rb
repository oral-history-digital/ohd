class RmUserProjectsIfAccessGrantedInstantly < ActiveRecord::Migration[7.0]
  def change
    UserProject.where(project_id: Project.where(grant_project_access_instantly: true).map(&:id)).destroy_all
  end
end
