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
      object.translations.map do |t|
        t.attributes.inject({}) do |mem, (k, v)|
          if [
            'introduction',
            'more_text',
            'landing_page_text',
            'restricted_landing_page_text'
          ].include?(k)
            mem[k] = ActionController::Base.helpers.sanitize(
              v,
              tags: %w[p br strong em u a ul ol li h1 h2 h3],
              attributes: %w[href]
            )
          else
            mem[k] = v
          end
          mem
        end
      end
    else
      []
    end
  end

  def project_id
    (object.respond_to?(:project_id) && object.project_id) ||
      (object.respond_to?(:interview) && object.interview && object.interview.project_id)
  end

end
