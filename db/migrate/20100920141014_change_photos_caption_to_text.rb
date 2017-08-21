class ChangePhotosCaptionToText < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    add_column :photos, :caption_string, :string

    Photo.update_all "caption_string = caption"

    remove_column :photos, :caption

    add_column :photos, :caption, :text

    Photo.update_all "caption = caption_string"

    remove_column :photos, :caption_string

  end
  end

  def self.down
  unless Project.name.to_sym == :eog

    # don't reverse the changes as the text field is backwards-compatible

  end
  end

end
