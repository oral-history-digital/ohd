class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :name,
             :notes,
             :parent_ids,
             :child_ids

  def name
    object.localized_hash
  end

  def notes
    object.localized_notes_hash
  end

  def latitude
    object.latitude.to_f
  end

  def longitude
    object.longitude.to_f
  end

end
