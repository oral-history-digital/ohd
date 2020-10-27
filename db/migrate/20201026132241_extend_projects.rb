class ExtendProjects < ActiveRecord::Migration[5.2]
  def up
    add_column :projects, :has_map, :boolean
    add_column :projects, :aspect_x, :integer
    add_column :projects, :aspect_y, :integer
    add_column :projects, :archive_id_number_length, :integer

    attributes = {
      aspect_x: 4, 
      aspect_y: 3,
      archive_id_number_length: 3
    }

    if [:cdoh, :mog].include?(Project.current.identifier.to_sym)
      attributes[:aspect_x] = 16
      attributes[:aspect_y] = 9
    end

    if Project.current.identifier.to_sym == :zwar
      attributes[:has_map] = true
    end

    Project.reset_column_information
    Project.current.update_attributes(attributes)
  end

  def down
    remove_column :projects, :has_map
    remove_column :projects, :aspect_x
    remove_column :projects, :aspect_y
    remove_column :projects, :archive_id_number_length
  end
end
