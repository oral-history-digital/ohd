class AddPositionToUserContents < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :mog
    change_table :user_contents do |t|
      t.integer :position, :default => 100
    end
  #end
  end

  def self.down
  #unless Project.name.to_sym == :mog
    remove_column :user_contents, :position
  #end
  end

end
