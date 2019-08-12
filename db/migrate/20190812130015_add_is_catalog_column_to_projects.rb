class AddIsCatalogColumnToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :is_catalog, :boolean, default: false
  end
end
