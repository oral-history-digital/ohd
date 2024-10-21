class SlimRegistryEntryMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_types, :labels, :lat, :lon

  def ref_types
    array = JSON.parse(object.ref_types)
    array.reduce({}, :merge)
  end

  def labels
    JSON.parse(object.labels)
  end

  def lat
    object.lat.to_f
  end

  def lon
    object.lon.to_f
  end
end
