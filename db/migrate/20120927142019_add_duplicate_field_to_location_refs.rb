class AddDuplicateFieldToLocationRefs < ActiveRecord::Migration

  def self.up
    change_table :location_references do |t|
      t.boolean :duplicate, :default => false
    end
  end

  def self.down
    change_table :location_references do |t|
      t.remove :duplicate
    end
  end

end
