class ImplementUserAnnotationUserContents< ActiveRecord::Migration

  def self.up
    change_table :user_contents do |t|
      t.string :workflow_state, :default => 'private'
    end
    change_table :annotations do |t|
      t.belongs_to :user_content
    end
  end

  def self.down
    remove_column :annotations, :user_content_id
    remove_column :user_contents, :workflow_state
  end

end
