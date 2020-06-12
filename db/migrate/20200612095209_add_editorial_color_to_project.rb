class AddEditorialColorToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :editorial_color, :string
  end
end
