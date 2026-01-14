class RegistryEntryWithAssociationsSerializer < RegistryEntrySerializer
  attributes :parent_ids,
             :child_ids,
             :registry_references,
             :bread_crumb,
             :ancestors

  def registry_references
    object.registry_references.
      includes(:ref_object).
      inject({}){|mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem}
  end

  def child_ids
    I18n.available_locales.inject({}) do |mem, locale|
      # fallback when name is empty
      mem[locale.to_s] = object.children.sort{ |a, b| a.descriptor(locale) <=> b.descriptor(locale)}.map(&:id)
      #mem[locale.to_s] = object.children.ordered_by_name(locale).map(&:id)
      mem
    end
  end

  def parent_ids
    object.parents.pluck(:id)
  end

  def ancestors
    # ancestors = object.ancestors.inject({}){|mem, a| mem[a.id] = ::RegistryEntrySerializer.new(a).as_json; mem }
    object.ancestors.includes(registry_names: :translations).inject({}){|mem, a| mem[a.id] = {id: a.id, code: a.code, name: a.localized_hash(:descriptor)}.as_json; mem }
  end

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    true
  end

end
