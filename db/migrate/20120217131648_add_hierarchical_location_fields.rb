class AddHierarchicalLocationFields < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_table :location_references do |t|
      t.string :region_name
      t.string :region_latitude
      t.string :region_longitude
      t.string :country_name
      t.string :country_latitude
      t.string :country_longitude
      t.integer :hierarchy_level
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_columns :location_references, :region_name, :region_latitude, :region_longitude
    remove_columns :location_references, :country_name, :country_latitude, :country_longitude
    remove_columns :location_references, :hierarchy_level
  end
  end

end
