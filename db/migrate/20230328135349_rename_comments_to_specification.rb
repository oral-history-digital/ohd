class RenameCommentsToSpecification < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :comments, :specification
  end
end
