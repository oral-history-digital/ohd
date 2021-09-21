class PersonSerializer < ApplicationSerializer
  attributes [
    :id, 
    :names, 
    :name,
    :text,
    :date_of_birth,
    :year_of_birth,
    :gender,
    :associations_loaded
  ]

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
