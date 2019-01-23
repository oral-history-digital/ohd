class AddColumnNameToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :name, :string
  end
end
