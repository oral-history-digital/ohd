class AddMediaIdToUserContents < ActiveRecord::Migration
  def self.up
    change_table :user_contents do |t|
      t.string  :media_id
    end
    add_index :user_contents, :media_id
  unless Project.name.to_sym == :eog
    add_index :annotations, :media_id
    say_with_time 'setting media_id for user_annotations' do
      # Do two things:
      # 1. Set media_id attribute based on the property, if nil
      # 2. Remove the media_id property
      UserAnnotation.find_each do |u|
        unless u.properties['media_id'].blank?
          u.media_id = u.properties['media_id']
          u.properties.delete('media_id')
          u.save
        end
      end
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    say_with_time 're-adding media_id property to user_annotations' do
      # Set media_id property based on media_id attribute for all
      # UserAnnotations.
      UserAnnotation.find_each do |u|
        unless u.media_id.blank?
          u.properties = u.properties.merge({'media_id' => u.media_id})
          u.save
        end
      end
    end
  end
    remove_column :user_contents, :media_id
  end
end
