class MapSectionSerializer < ApplicationSerializer
  attributes :id, :name, :corner1_lat, :corner1_lon, :corner2_lat,
    :corner2_lon, :order, :label

  def label
    object.localized_hash(:label)
  end
end
