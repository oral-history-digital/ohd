class AddPublicationTimestampsToUserContent < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    UserAnnotation.delete_all
    change_table :user_contents do |t|
      t.datetime :submitted_at
      t.datetime :published_at
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_columns :user_contents, :submitted_at, :published_at
  end
  end

end
