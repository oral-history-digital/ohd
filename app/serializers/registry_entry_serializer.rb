class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :descriptor

  def descriptor
    object.to_s
  end

  def latitude
    object.latitude.to_f
  end

  def longitude
    object.longitude.to_f
  end

end
