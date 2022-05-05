class CreateNormDataProviders < ActiveRecord::Migration[5.2]
  def change
    create_table :norm_data_providers do |t|
      t.string :name
      t.string :api_name
      t.string :url_without_id

      t.timestamps
    end

    add_column :norm_data, :norm_data_provider_id, :integer
    remove_column :norm_data, :provider, :string

    NormDataProvider.create name: 'GND', api_name: 'd-nb.info', url_without_id: 'https://d-nb.info/gnd/'
    NormDataProvider.create name: 'OSM', api_name: 'openstreetmap.org', url_without_id: 'https://www.openstreetmap.org/'
  end
end
