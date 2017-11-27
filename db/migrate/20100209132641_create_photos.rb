class CreatePhotos < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    create_table :photos do |t|
      t.references :interview
      t.string :photo_file_name
      t.string :photo_content_type
      t.integer :photo_file_size
      t.datetime :photo_updated_at
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    drop_table :photos
  end
  end
end
