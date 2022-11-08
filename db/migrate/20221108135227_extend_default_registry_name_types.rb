class ExtendDefaultRegistryNameTypes < ActiveRecord::Migration[5.2]
  def up
    Project.all.each do |project|
      {
        spelling: 'Bezeichner',
        original: 'Originalbezeichnung',
        ancient: 'Ehemalige Bezeichnung'
      }.each do |code, name|
        registry_name_type = RegistryNameType.where(
          code: code,
          project_id: project.id
        ).first
        unless registry_name_type
          RegistryNameType.create(
            code: code,
            name: name,
            order_priority: 3,
            project_id: project.id
          )
        end
      end
    end
  end

  def down
  end
end
