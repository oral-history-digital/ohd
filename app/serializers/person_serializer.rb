class PersonSerializer < ActiveModel::Serializer
  attributes :id, :date_of_birth, :gender, :name, :names, :typology, :place_of_birth, :biographical_entries
            # :histories

  def names
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {firstname: i.first_name,
                         lastname: i.last_name,
                         birthname: i.birth_name} if Project.available_locales.include?( alpha2_locale )}
  end

  def date_of_birth
    return "" if object.date_of_birth.blank?
    if Project.name.to_sym === :mog
      object.date_of_birth.sub(/^\.+/,"").split('.').map{|i| "%.2i" %i}.join('.')
    else
      object.date_of_birth
    end
  end

  def typology
    facets = object.typology ? object.typology.split(',') : []
    object.translations.each_with_object({}) {|i, hsh |
      alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
      hsh[alpha2_locale] = facets.map{|typology|
        I18n.backend.translate(alpha2_locale, "search_facets.#{typology.parameterize(separator: '_')}")
      } if Project.available_locales.include?( alpha2_locale )}
  end

  #def histories
    #object.histories.inject({}){|mem, c| mem[c.id] = Rails.cache.fetch("history-#{c.id}-#{c.updated_at}"){HistorySerializer.new(c)}; mem}
  #end

  def biographical_entries
    object.biographical_entries.inject({}){|mem, c| mem[c.id] = Rails.cache.fetch("biographical_entry-#{c.id}-#{c.updated_at}"){BiographicalEntrySerializer.new(c)}; mem}
  end

  def place_of_birth
    RegistryEntrySerializer.new(object.place_of_birth) if object.place_of_birth
  end

end
