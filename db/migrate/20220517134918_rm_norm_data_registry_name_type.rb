class RmNormDataRegistryNameType < ActiveRecord::Migration[5.2]
  def change
    Project.all.each do |project|
      spelling = project.registry_name_types.where(code: 'spelling').first
      norm_data = project.registry_name_types.where(code: 'norm_data').first
      norm_data.registry_names.update_all(registry_name_type_id: spelling.id) if norm_data
    end

    RegistryNameType.where(code: 'norm_data').destroy_all
  end
end
