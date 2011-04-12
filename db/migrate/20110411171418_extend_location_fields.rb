class ExtendLocationFields < ActiveRecord::Migration

  # some fields just need more space!
  def self.up
    change_column :interviews, :forced_labor_locations, :text
    change_column :location_references, :alias_location_names, :text
  end

  def self.down
    change_column :interviews, :forced_labor_locations, :string
    change_column :location_references, :alias_location_names, :string
  end
  
end
