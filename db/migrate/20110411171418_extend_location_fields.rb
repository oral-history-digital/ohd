class ExtendLocationFields < ActiveRecord::Migration

  # some fields just need more space!
  def self.up
  unless Project.name.to_sym == :mog
    change_column :interviews, :forced_labor_locations, :text
    change_column :location_references, :alias_location_names, :text
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    change_column :interviews, :forced_labor_locations, :string
    change_column :location_references, :alias_location_names, :string
  end
  end
  
end
