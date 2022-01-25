class RemoveMapSectionColumnsFromProjects < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :map_initial_center_lat, :decimal,
                  precision: 10, scale: 6, default: 49.546944
    remove_column :projects, :map_initial_center_lon, :decimal,
                  precision: 10, scale: 6, default: 16.573333
    remove_column :projects, :map_initial_zoom, :integer, default: 4
  end
end
