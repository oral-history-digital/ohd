class PersonSerializer < ApplicationSerializer
  attributes [
    :id, 
    :names, 
    :name,
    :text,
    :date_of_birth,
    :associations_loaded
  ]

  def names
    object.translations.inject({}) do |mem, translation|
      mem[translation.locale] = {
        firstname: translation.first_name || object.first_name(I18n.default_locale), 
        lastname: translation.last_name || object.last_name(I18n.default_locale), 
        aliasname: translation.alias_names || object.alias_names(I18n.default_locale), 
        birthname: translation.birth_name || object.birth_name(I18n.default_locale), 
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
      if object.project.identifier.to_sym === :mog
        object.date_of_birth.sub(/^\.+/, "").split(".").map { |i| "%.2i" % i }.join(".")
      elsif object.project.identifier.to_sym === :zwar
        object.date_of_birth.split("-").reverse.join(".")
      else
        object.date_of_birth
      end
    end
  end

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    false
  end

end
