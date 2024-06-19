class UpdateNormDataProviders < ActiveRecord::Migration[7.0]
  def up
    NormDataProvider.where(name: 'GND').first.update name: 'gnd'
    NormDataProvider.where(name: 'OSM').first.update name: 'osm'
    NormDataProvider.create name: "wikidata", url_without_id: "http://www.wikidata.org/entity/"
    NormDataProvider.create name: "geonames", url_without_id: "https://www.geonames.org/"
  end

  def down
  end
end
