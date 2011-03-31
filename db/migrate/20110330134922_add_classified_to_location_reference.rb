class AddClassifiedToLocationReference < ActiveRecord::Migration

  def self.up
    change_table :location_references do |t|
      t.boolean :classified, :default => true
    end
  end

  def self.down
    remove_column :location_references, :classified
  end

end
