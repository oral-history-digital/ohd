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

end

