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

  #
  # serialized compiled cache of an instance
  #
  def cache_single(project, data, name = nil, related = nil)
    Rails.cache.fetch("#{project.shortname}-#{(name || data.class.name).underscore}-#{data.id}-#{data.updated_at}-#{related && data.send(related).updated_at}") do
      raw = "#{name || data.class.name}Serializer".constantize.new(data)
      # compile raw-json to string first (making all db-requests!!) using to_json
      # without to_json the lazy serializers wouldn`t do the work to really request the db
      #
      # then parse it back to json
      #
      JSON.parse(raw.to_json)
    end
  end

  def project_id
    (object.respond_to?(:project_id) && object.project_id) ||
      (object.respond_to?(:interview) && object.interview && object.interview.project_id)
  end

end
