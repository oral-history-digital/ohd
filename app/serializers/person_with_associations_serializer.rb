class PersonWithAssociationsSerializer < PersonSerializer

  attributes [
               :biographical_entries,
               :registry_references,
               :events
             ]
             #MetadataField.where(source: "Person").map(&:name)

  def attributes(*args)
    hash = super
    object.project.registry_reference_type_metadata_fields.where(ref_object_type: 'Person').each do |m|
      hash[m.name] = object.project.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(m.name).compact.uniq.map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
        mem
      end
    end
    hash
  end

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    true
  end

  def biographical_entries
    object.biographical_entries.inject({}) { |mem, c| mem[c.id] = BiographicalEntrySerializer.new(c); mem }
    #
    # caching results in 'singleton can't be dumped'-error here. Why?
    #
    #object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  def events
    object.events.map { |e| EventSerializer.new(e) }
  end

  def registry_references
    object.registry_references && object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

end
