class ChangeColumnProjectIdInCollections < ActiveRecord::Migration[5.2]
  def change
    execute "UPDATE collections SET project_id = #{Project.current.id}"
    change_column :collections, :project_id, :integer
  end
end
