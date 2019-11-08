class PersonSerializer < ApplicationSerializer
  attributes [
               :id,
               :biographical_entries,
               :name,
               :names,
               :text,
               :typology,
               :registry_references,
             # :histories
             ] |
             MetadataField.where(ref_object_type: "Person", source: "registry_reference_type").inject([]) { |mem, i| mem << i.name } |
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

  MetadataField.where(source: "registry_reference_type", ref_object_type: "Person").each do |f|
    define_method f.name do
      registry_entry = object.send(f.name)
      registry_entry && registry_entry.localized_hash || {}
    end
  end

  Person.translated_attribute_names.each do |name|
    define_method name do
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(name, locale)
        mem
      end
    end
  end

  def typology
    if object.typology
      facets = object.typology.split(",")
      object.translations.each_with_object({}) { |i, hsh|
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        if I18n.available_locales.include?(alpha2_locale.to_sym)
          hsh[alpha2_locale] = facets.map { |typology|
            I18n.translate("search_facets.#{typology.parameterize(separator: "_")}", locale: alpha2_locale.to_sym)
          }
        end
      }
    end
  end

  def histories
    object.histories.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.cache_key_prefix}-history-#{c.id}-#{c.updated_at}") { HistorySerializer.new(c) }; mem }
  end

  def biographical_entries
    object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.current.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  Project.current.registry_reference_type_metadata_fields.select { |f| f["ref_object_type"] == "person" }.each do |f|
    define_method f["name"] do
      RegistryEntrySerializer.new(object.send(f["name"])) if object.send(f["name"])
    end
  end

  def registry_references
    object.registry_references && object.registry_references.inject({}) { |mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem }
  end

end
