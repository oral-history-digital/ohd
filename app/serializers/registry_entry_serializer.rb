class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :descriptor

  def latitude
    object[:latitude].nil? ? nil : object[:latitude]
  end

  def longitude
    object[:longitude].nil? ? nil : object[:longitude]
  end


  def descriptor
    object.to_s
  end

end
