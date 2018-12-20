class AddColumnWokflowStateToPhotos < ActiveRecord::Migration[5.2]
  def change
    add_column :photos, :workflow_state, :string
  end
end
