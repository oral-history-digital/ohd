class PersonWithAssociationsSerializer < PersonSerializer

  attributes [
               :biographical_entries,
               :registry_references,
               :events
             ]
             #MetadataField.where(source: "Person").map(&:name)

  def attributes(*args)
    hash = super
    object.project.registry_reference_type_metadata_fields.where(ref_object_type: 'Person').each do |field|
      registry_entry_ids = object.registry_references.
        where(registry_reference_type_id: field.registry_reference_type_id).
        map(&:registry_entry_id).uniq.compact

      hash[field.name] = (
        instance_options[:project_available_locales] ||
        object.project.available_locales
      ).inject({}) do |mem, locale|
        mem[locale] = registry_entry_ids.map do |id|
          RegistryEntry.find(id).to_s(locale)
        end.join(", ")
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
    #object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.shortname}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  def events
    object.events.map { |e| EventSerializer.new(e) }
  end

  def registry_references
    object.registry_references && object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

end
