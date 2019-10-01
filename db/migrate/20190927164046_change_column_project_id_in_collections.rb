class ChangeColumnProjectIdInCollections < ActiveRecord::Migration[5.2]
  def change
    change_column :collections, :project_id, :integer
  end
end
