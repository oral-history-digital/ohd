class AddCaptionToPhotos < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    change_table :photos do |t|
      t.string :caption
    end

  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :photos, :caption
  end
  end

end
