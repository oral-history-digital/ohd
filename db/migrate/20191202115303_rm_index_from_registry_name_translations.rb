class RmIndexFromRegistryNameTranslations < ActiveRecord::Migration[5.2]
  def change
    remove_index :registry_name_translations, :descriptor
    #remove_index :registry_name_translations, column: ["registry_name_id", "locale"]
    #remove_index :registry_name_translations, column: ["registry_name_id"]
    add_index :registry_name_translations, :descriptor, :length => 191
    #add_index :registry_name_translations, ["registry_name_id", "locale"], :length => 20
    add_index :registry_name_translations, ["registry_name_id"]
  end
end
