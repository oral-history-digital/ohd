class AddPublicationTimestampsToUserContent < ActiveRecord::Migration

  def self.up
    UserAnnotation.delete_all
    change_table :user_contents do |t|
      t.datetime :submitted_at
      t.datetime :published_at
    end
  end

  def self.down
    remove_columns :user_contents, :submitted_at, :published_at
  end

end
