class AddColumnSpecificationToUserProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :user_projects, :specification, :text
    add_column :user_projects, :research_intentions, :text
  end
end
