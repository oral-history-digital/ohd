class PermissionSerializer < ActiveModel::Serializer
  attributes :id,
    :controller,
    :action
end
