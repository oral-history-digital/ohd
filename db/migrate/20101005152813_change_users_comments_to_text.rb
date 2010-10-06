class ChangeUsersCommentsToText < ActiveRecord::Migration

  def self.up
    change_column :users, :comments, :text
  end

  def self.down
    change_column :users, :comments, :string
  end
  
end
