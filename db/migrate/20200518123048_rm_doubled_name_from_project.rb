class RmDoubledNameFromProject < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :name
  end
end
