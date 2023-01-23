class PersonSerializer < ApplicationSerializer
  attributes [
    :id,
    :names,
    :name,
    :display_name,
    :initials,
    :text,
    :date_of_birth,
    :year_of_birth,
    :gender,
    :title,
    :description,
    :associations_loaded,
    :created_at,
    :updated_at
    :use_pseudonym
  ]

  def description
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.description(locale)
      mem
    end
  end

  # dummy. will be filled in search
  def text
    {}
  end

  #
  # this method is to determine in react whether a person serialized with PersonSerializerWithAssociations has to be loaded
  #
  def associations_loaded
    false
  end

end
