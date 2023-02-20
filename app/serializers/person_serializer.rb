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
    :use_pseudonym,
    :events,
    :created_at,
    :updated_at
  ]

  def description
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.description(locale)
      mem
    end
  end

  def events
    object.events.map { |e| EventSerializer.new(e) }
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
