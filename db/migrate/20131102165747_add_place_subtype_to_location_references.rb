class AddPlaceSubtypeToLocationReferences < ActiveRecord::Migration

  def self.up
    change_table :location_references do |t|
      t.string :place_subtype
    end
  end

  def self.down
    remove_column :location_references, :place_subtype
  end
end
