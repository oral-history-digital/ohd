class AddIndexOnRegistryCodes < ActiveRecord::Migration[5.2]
  def change
    add_index  :registry_entries, :code, length: 50
    add_index  :registry_reference_types, :code, length: 50
  end
end
