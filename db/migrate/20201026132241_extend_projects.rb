class ExtendProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :has_map, :boolean
    add_column :projects, :aspect_x, :integer
    add_column :projects, :aspect_y, :integer
    add_column :projects, :archive_id_number_length, :integer
  end
end
