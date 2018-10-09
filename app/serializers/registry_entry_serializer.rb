class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :name,
             :notes,
             :parent_ids,
             :child_ids,
             :workflow_state,
             :registry_references

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

  def registry_references
    object.registry_references.inject({}){|mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem}
  end
end
