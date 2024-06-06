class ApplicationSerializer < ActiveModel::Serializer
  attributes :id, :type, :translations_attributes, :project_id

  def type
    object.class.name
  end

  # serialized translations are needed to construct 'translations_attributes' e.g. in MultiLocaleInput
  # containing the id of a translation
  #
  # without the id a translation would not be updated but newly created!!
  #
  def translations_attributes
    if object.respond_to? :translations
      object.translations.map(&:as_json)
    else
      []
    end
  end

  def project_id
    (object.respond_to?(:project_id) && object.project_id) ||
      (object.respond_to?(:interview) && object.interview && object.interview.project_id)
  end

end
