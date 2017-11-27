class ChangeUsersCommentsToText < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :mog
    change_column :users, :comments, :text
  #end
  end

  def self.down
  #unless Project.name.to_sym == :mog
    change_column :users, :comments, :string
  #end
  end
  
end
