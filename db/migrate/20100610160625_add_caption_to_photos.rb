class AddCaptionToPhotos < ActiveRecord::Migration

  def self.up

    change_table :photos do |t|
      t.string :caption
    end

  end

  def self.down
    remove_column :photos, :caption
  end

end
