class PermissionSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :desc,
    :controller,
    :action
end
