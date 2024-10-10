class ChangeRegistryEntriesColumns < ActiveRecord::Migration[7.0]
  def change
    change_column_default :registry_entries, :latitude, from: nil, to: ""
    change_column_default :registry_entries, :longitude, from: nil, to: ""

    #change_column_null :registry_entries, :latitude, false
    #change_column_null :registry_entries, :longitude, false
  end
end
