class RmNormDataRegistryNameType < ActiveRecord::Migration[5.2]
  def change
    Project.all.each do |project|
      spelling = project.registry_name_types.where(code: 'spelling').first
      project.registry_name_types.where(code: 'norm_data').first.registry_names.update_all(registry_name_type_id: spelling.id)
    end

    RegistryNameType.where(code: 'norm_data').destroy_all
  end
end
