class PersonSerializer < ApplicationSerializer
  attributes :id, :date_of_birth, :gender, :names, :name, :typology, :place_of_birth, :biographical_entries, :text
            # :histories

  def names
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {firstname: i.first_name,
                         lastname: i.last_name,
                         birthname: i.birth_name} if Project.available_locales.include?( alpha2_locale )}
  end

  # dummy. will be filled in search
  def text
    {}
  end

  def date_of_birth
    unless object.date_of_birth.blank?
      if Project.name.to_sym === :mog
        object.date_of_birth.sub(/^\.+/,"").split('.').map{|i| "%.2i" %i}.join('.')
      elsif Project.name.to_sym === :zwar
        object.date_of_birth.split("-").reverse.join(".")
      else
        object.date_of_birth
      end
    end
  end

  def typology
    if object.typology
      facets = object.typology.split(',')
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = facets.map{|typology|
          I18n.backend.translate(alpha2_locale, "search_facets.#{typology.parameterize(separator: '_')}")
        } if Project.available_locales.include?( alpha2_locale )}
    end
  end

  #def histories
    #object.histories.inject({}){|mem, c| mem[c.id] = Rails.cache.fetch("#{Project.project_id}-history-#{c.id}-#{c.updated_at}"){HistorySerializer.new(c)}; mem}
  #end

  def biographical_entries
    object.biographical_entries.inject({}){|mem, c| mem[c.id] = Rails.cache.fetch("#{Project.cache_key_prefix}-biographical_entry-#{c.id}-#{c.updated_at}"){BiographicalEntrySerializer.new(c)}; mem}
  end

  def place_of_birth
    RegistryEntrySerializer.new(object.place_of_birth) if object.place_of_birth
  end

end
