class AddColumnsToPhotos < ActiveRecord::Migration[5.2]
  def change
    add_column :photos, :date, :string
    add_column :photos, :place, :string
    add_column :photos, :photographer, :string
    add_column :photos, :license, :string
  end
end
