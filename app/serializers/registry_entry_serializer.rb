class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :descriptor

  def descriptor
    object.to_s
  end

end
