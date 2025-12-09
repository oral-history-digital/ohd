class CreateNormdataApiStatistics < ActiveRecord::Migration[8.0]
  def change
    create_table :normdata_api_statistics do |t|
      t.string :search_term
      t.string :saved_entry
      t.integer :registry_entry_id
      t.timestamps
    end
  end
end
