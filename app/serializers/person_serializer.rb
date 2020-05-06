class PersonSerializer < ApplicationSerializer
  attributes [
               :id,
               :biographical_entries,
               :name,
               :names,
               :text,
               :registry_references,
             # :histories
             ] |
             MetadataField.where(ref_object_type: "Person", source: "RegistryReferenceType").inject([]) { |mem, i| mem << i.name } |
             MetadataField.where(source: "Person").inject([]) { |mem, i| mem << i.name }

  def names
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = {
        firstname: object.first_name(locale) || object.first_name(I18n.default_locale), 
        lastname: object.last_name(locale) || object.last_name(I18n.default_locale), 
        aliasname: object.alias_names(locale) || object.alias_names(I18n.default_locale), 
        birthname: object.birth_name(locale) || object.birth_name(I18n.default_locale), 
      }
      mem
    end
  end

  # dummy. will be filled in search
  def text
    {}
  end

  def date_of_birth
    unless object.date_of_birth.blank?
      if Project.current.identifier.to_sym === :mog
        object.date_of_birth.sub(/^\.+/, "").split(".").map { |i| "%.2i" % i }.join(".")
      elsif Project.current.identifier.to_sym === :zwar
        object.date_of_birth.split("-").reverse.join(".")
      else
        object.date_of_birth
      end
    end
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
