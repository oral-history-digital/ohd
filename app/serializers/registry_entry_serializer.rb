class RegistryEntrySerializer < ApplicationSerializer
  attributes :id,
             :latitude,
             :longitude,
             :desc,
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
    object.ancestors.inject({}){|mem, a| mem[a.id] = {id: a.id, name: a.localized_hash(:descriptor)}.as_json; mem }
  end

end
