class AddPositionToUserContents < ActiveRecord::Migration

  def self.up
    change_table :user_contents do |t|
      t.integer :position, :default => 100
    end
  end

  def self.down
    remove_column :user_contents, :position
  end

end
