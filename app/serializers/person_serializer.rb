class PersonSerializer < ActiveModel::Serializer
  attributes :id, :date_of_birth, :gender, :histories, :names, :typology, :place_of_birth


  def names
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {firstname: i.first_name,
                         lastname: i.last_name,
                         birthname: i.birth_name} if Project.available_locales.include?( alpha2_locale )}
  end

  def date_of_birth
    return "" if object.date_of_birth.blank?
    object.date_of_birth.sub(/^\.+/,"").split('.').map{|i| "%.2i" %i}.join('.')
  end

  def typology
    facets = object.typology ? object.typology.split(',') : []
    object.translations.each_with_object({}) {|i, hsh |
      alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
      hsh[alpha2_locale] = facets.map{|typology|
        I18n.backend.translate(alpha2_locale, "search_facets.#{typology.parameterize(separator: '_')}")
      } if Project.available_locales.include?( alpha2_locale )}
  end

  def histories
    object.histories.map{ |history|
      history.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {event_begin: i.deportation_date,
                         event_end: i.return_date,
                         event_description: i.forced_labor_details} if Project.available_locales.include?( alpha2_locale )}}
  end


  def place_of_birth
    RegistryEntrySerializer.new(object.place_of_birth) if object.place_of_birth
  end

end
