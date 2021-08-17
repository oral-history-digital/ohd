class AddProjectIdToUserContents < ActiveRecord::Migration[5.2]
  def up
    add_column :user_contents, :project_id, :integer
    UserContent.update_all project_id: Project.first.id
  end
  def down
    remove_column :user_contents, :project_id
  end
end
