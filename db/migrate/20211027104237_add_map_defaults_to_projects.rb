class AddMapDefaultsToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :map_initial_center_lat, :decimal,
               precision: 10, scale: 6, default: 49.546944
    add_column :projects, :map_initial_center_lon, :decimal,
               precision: 10, scale: 6, default: 16.573333
    add_column :projects, :map_initial_zoom, :integer, default: 4
  end
end
