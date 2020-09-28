class PersonWithAssociationsSerializer < PersonSerializer

  attributes [
               :biographical_entries,
               :registry_references,
             ] |
             MetadataField.where(ref_object_type: "Person", source: "RegistryReferenceType").map(&:name) |
             MetadataField.where(source: "Person").map(&:name)

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    true
  end

  Project.current.registry_reference_type_metadata_fields.where(ref_object_type: 'Person').each do |m|
    define_method m.name do
      # can handle object.send(m.name) = nil
      json = Rails.cache.fetch("#{object.project.cache_key_prefix}-#{m.name}-#{object.id}-#{object.updated_at}-#{m.updated_at}") do
        if !!object.send(m.name).try("any?")
          I18n.available_locales.inject({}) do |mem, locale|
            mem[locale] = object.send(m.name).map { |f| RegistryEntry.find(f).to_s(locale) }.join(", ")
            mem
          end
        else
          {}
        end
      end
    end
  end

  def biographical_entries
    object.biographical_entries.inject({}) { |mem, c| mem[c.id] = BiographicalEntrySerializer.new(c); mem }
    #
    # caching results in 'singleton can't be dumped'-error here. Why?
    #
    #object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  def registry_references
    object.registry_references && object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

end
