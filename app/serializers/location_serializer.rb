class LocationSerializer < ApplicationSerializer
  attributes :id,
             :latitude,
             :longitude,
             :desc,
             :ref_object_id,
             :ref_object_type

  belongs_to :ref_object, serializer: LastHeadingSerializer

  def desc
    object.registry_entry && object.registry_entry.localized_hash(:descriptor)
    #object.registry_entry.name(:all)
  end

  def latitude
    object.registry_entry && object.registry_entry.latitude.to_f
  end

  def longitude
    object.registry_entry && object.registry_entry.longitude.to_f
  end

end
