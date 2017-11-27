class AddPlaceSubtypeToLocationReferences < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_table :location_references do |t|
      t.string :place_subtype
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :location_references, :place_subtype
  end
  end
end
