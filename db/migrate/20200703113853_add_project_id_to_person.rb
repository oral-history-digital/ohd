class AddProjectIdToPerson < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :project_id, :integer
    Person.update_all(project_id: Project.first.id)
  end
end
