class AddIndexOnRegistryCodes < ActiveRecord::Migration[5.2]
  def change
    add_index  :registry_entries, :code
    add_index  :registry_reference_types, :code
  end
end
