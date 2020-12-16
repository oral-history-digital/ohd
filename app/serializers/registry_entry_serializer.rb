class RegistryEntrySerializer < ApplicationSerializer
  attributes :id,
             :latitude,
             :longitude,
             :desc,
             :name,
             :notes,
             :workflow_state,
             :code,
             :parent_registry_hierarchy_ids,
             :children_count,
             :registry_references_count,
             :associations_loaded

  has_many :registry_names

  def name
    object.localized_hash(:descriptor)
  end

  def notes
    object.localized_notes_hash
  end

  def latitude
    # exclude dedalo default location (Valencia)
    object.latitude == '39.462571' ? nil : object.latitude.to_f
  end

  def longitude
    # exclude dedalo default location (Valencia)
    object.longitude == '-0.376295' ? nil : object.longitude.to_f
  end

  def parent_registry_hierarchy_ids
    object.parent_registry_hierarchies.inject({}){|mem, h| mem[h.ancestor_id] = h.id; mem}
  end

  #
  # this method is to determine in react whether RegistryEntryWithAssociationsSerializer has to be loaded
  #
  def associations_loaded
    false
  end

end
