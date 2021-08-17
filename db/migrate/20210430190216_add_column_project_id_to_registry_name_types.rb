class AddColumnProjectIdToRegistryNameTypes < ActiveRecord::Migration[5.2]
  def up
    add_column :registry_name_types, :project_id, :integer
    RegistryNameType.update_all project_id: Project.first.id
  end
  def down
    remove_column :registry_name_types, :project_id
  end
end
