class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :latitude,
             :longitude,
             :name,
             :notes,
             :parent_ids,
             :child_ids,
             :workflow_state,
             :registry_references,
             :parent_registry_hierarchy_ids,
             :bread_crumb,
             :ancestors

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

  def child_ids
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale.to_s] = object.alphanum_sorted_ids(:children, locale)
      mem
    end
  end

  def parent_ids
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale.to_s] = object.alphanum_sorted_ids(:parents, locale)
      mem
    end
  end

  def parent_registry_hierarchy_ids
    object.parent_registry_hierarchies.inject({}){|mem, h| mem[h.ancestor_id] = h.id; mem}
  end

  def ancestors
    # ancestors = object.ancestors.inject({}){|mem, a| mem[a.id] = ::RegistryEntrySerializer.new(a).as_json; mem }
    object.ancestors.inject({}){|mem, a| mem[a.id] = {id: a.id, name: a.localized_hash}.as_json; mem }
  end

end
