class PersonSerializer < ApplicationSerializer
  attributes [
               :id,
               :biographical_entries,
               :name,
               :names,
               :text,
               :typology,
             # :histories
             ] |
             MetadataField.where(ref_object_type: "Person", source: "registry_reference_type").inject([]) { |mem, i| mem << i.name } |
             MetadataField.where(source: "Person").inject([]) { |mem, i| mem << i.name }

  def names
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = { 
        firstname: object.first_name(locale),
        lastname: object.last_name(locale),
        aliasname: object.alias_names(locale),
        birthname: object.birth_name(locale) 
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

  def birth_location
    (object.birth_location && object.birth_location.localized_hash) || {}
  end

  def typology
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.typology && object.typology.split(',').map{|t| I18n.t(t, scope: 'search_facets')}.join(', ')
      mem
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
end
