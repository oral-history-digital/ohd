class AddIndexes2 < ActiveRecord::Migration[7.0]
  def change
    add_index :registry_name_translations, :locale
  end
end
