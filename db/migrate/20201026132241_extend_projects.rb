class ExtendProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :has_map, :boolean
    add_column :projects, :aspect_x, :integer
    add_column :projects, :aspect_y, :integer
    add_column :projects, :archive_id_number_length, :integer
  end

  attributes = {
    aspect_x: 4, 
    aspect_y: 3,
    archive_id_number_length: 3
  }

  if [:cdoh, :mog].includes?(Project.current.identifier.to_sym)
    attributes[:aspect_x] = 16
    attributes[:aspect_x] = 9
  end

  if Project.current.identifier.to_sym == :zwar
    attributes[:has_map] = true
  end

  Project.current.update_attributes(attributes)
end
