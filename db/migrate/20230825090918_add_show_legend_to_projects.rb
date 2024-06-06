class AddShowLegendToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :show_legend, :boolean, default: true
  end
end
