class ApplicationSerializer < ActiveModel::Serializer
  attributes :id, :type

  def type 
    object.class.name
  end

  # this is to calculate  permissions on the serialized object
  #
  # so a user needs the permission with attributes type == object.class.name and action_name == update
  # or a task with authorized_type == object.class.name and authorized_id == object.id
  # to see all necessary buttons
  #
  # see the admin-function in app/javascript/lib/utils.js
  #
  def action
    :update
  end

  # serialized translations are needed to construct 'translations_attributes' e.g. in MultiLocaleInput
  # containing the id of a translation
  #
  # without the id a translation would not be updated but newly created!!
  #
  def translations
    if object.respond_to? :translations
      object.translations.inject([]) do |mem, translation|
        mem.push(translation.attributes.reject { |k, v| !(object.translated_attribute_names + [:id, :locale]).include?(k.to_sym) })
        mem
      end
    else
      []
    end
  end

end

