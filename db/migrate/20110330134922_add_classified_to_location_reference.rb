class AddClassifiedToLocationReference < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_table :location_references do |t|
      t.boolean :classified, :default => true
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :location_references, :classified
  end
  end

end
