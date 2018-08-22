class AddAuthorIdToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :author_id, :integer
  end
end
