class CreateNormData < ActiveRecord::Migration[5.2]
  def change
    create_table :norm_data do |t|
      t.string :provider
      t.string :nid
      t.integer :registry_entry_id

      t.timestamps
    end
  end
end
