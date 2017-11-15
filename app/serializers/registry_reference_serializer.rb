class RegistryReferenceSerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :desc,
             :ref_object_id,
             :ref_object_type

  def desc
    object.registry_entry && object.registry_entry.localized_hash
    #object.registry_entry.descriptor(:all)
  end

  def latitude
    object.registry_entry && object.registry_entry.latitude.to_f
  end

  def longitude
    object.registry_entry && object.registry_entry.longitude.to_f
  end

end
