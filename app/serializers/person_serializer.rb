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
             MetadataField.where(ref_object_type: 'Person', source: 'registry_reference_type').inject([]) { |mem, i| mem << i.name } |
             MetadataField.where(source: 'Person').inject([]) { |mem, i| mem << i.name } 


  def names
    object.translations.each_with_object({}) { |i, hsh|
      alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
      hsh[alpha2_locale] = { firstname: i.first_name,
                            lastname: i.last_name,
                            birthname: i.birth_name } 
    }
  end

  # dummy. will be filled in search
  def text
    {}
  end

  def date_of_birth
    unless object.date_of_birth.blank?
      if Project.name.to_sym === :mog
        object.date_of_birth.sub(/^\.+/, "").split(".").map { |i| "%.2i" % i }.join(".")
      elsif Project.name.to_sym === :zwar
        object.date_of_birth.split("-").reverse.join(".")
      else
        object.date_of_birth
      end
    end
  end

  def typology
    if object.typology
      facets = object.typology.split(",")
      object.translations.each_with_object({}) { |i, hsh|
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = facets.map { |typology|
          I18n.backend.translate(alpha2_locale, "search_facets.#{typology.parameterize(separator: "_")}")
        } if I18n.available_locales.include?(alpha2_locale)
      }
    end
  end

  def histories
    object.histories.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.cache_key_prefix}-history-#{c.id}-#{c.updated_at}") { HistorySerializer.new(c) }; mem }
  end

  def biographical_entries
    object.biographical_entries.inject({}) { |mem, c| mem[c.id] = Rails.cache.fetch("#{Project.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}") { BiographicalEntrySerializer.new(c) }; mem }
  end

  Project.actual.registry_reference_type_metadata_fields.select { |f| f["ref_object_type"] == "person" }.each do |f|
    define_method f["name"] do
      RegistryEntrySerializer.new(object.send(f["name"])) if object.send(f["name"])
    end
  end
end
