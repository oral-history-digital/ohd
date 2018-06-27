class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :descriptor

  def descriptor
    object.localized_hash
  end

  def latitude
    object.latitude.to_f
  end

  def longitude
    object.longitude.to_f
  end

end
