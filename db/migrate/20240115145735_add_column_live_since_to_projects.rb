class AddColumnLiveSinceToProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :live_since, :date
  end
end
