class AddHasGeoCoordsToRegistryEntries < ActiveRecord::Migration[7.0]
  def change
    add_column :registry_entries, :has_geo_coords, :virtual, type: :boolean,
      as: "`latitude` is not null and `latitude` <> '' and `longitude` is not null and `longitude` <> ''",
      stored: true
    add_index :registry_entries, :has_geo_coords
  end
end
