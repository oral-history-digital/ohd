class ChangeRegistryEntriesColumns2 < ActiveRecord::Migration[7.0]
  def up
    RegistryEntry.where(latitude: nil).update_all(latitude: "")
    RegistryEntry.where(longitude: nil).update_all(longitude: "")

    change_column_null :registry_entries, :latitude, false
    change_column_null :registry_entries, :longitude, false
  end

  def down
    change_column_null :registry_entries, :latitude, true
    change_column_null :registry_entries, :longitude, true

    RegistryEntry.where(latitude: "").update_all(latitude: nil)
    RegistryEntry.where(longitude: "").update_all(longitude: nil)
  end
end
