class PersonWithAssociationsSerializer < PersonSerializer

  attributes [
               :biographical_entries,
               :registry_references,
             ] |
             MetadataField.where(ref_object_type: "Person", source: "RegistryReferenceType").map(&:name)
             MetadataField.where(source: "Person").map(&:name)

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    true
  end

  MetadataField.where(source: "RegistryReferenceType", ref_object_type: "Person").each do |f|
    define_method f.name do
      registry_entry = object.send(f.name)
      registry_entry && registry_entry.localized_hash(:descriptor) || {}
    end
  end

  def biographical_entries
    object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  def registry_references
    object.registry_references && object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

end
