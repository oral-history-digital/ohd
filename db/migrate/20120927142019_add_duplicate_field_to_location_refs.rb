class AddDuplicateFieldToLocationRefs < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_table :location_references do |t|
      t.boolean :duplicate, :default => false
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    change_table :location_references do |t|
      t.remove :duplicate
    end
  end
  end

end
