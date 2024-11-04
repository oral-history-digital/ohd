class SlimRegistryEntryMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_types, :labels, :lat, :lon

  def ref_types
    array = JSON.parse(object.ref_types)
    # On some systems (e.g. our production server) the database seems
    # to encode the data twice, so we need to conditionally run a
    # second JSON.parse for every array element.
    if array[0].is_a? String
      array = array.map { |el| JSON.parse(el) }
    end
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
