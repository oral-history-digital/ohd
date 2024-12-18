class PermissionSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :desc,
    :klass,
    :action_name,
    :created_at

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %M:%H Uhr')
  end

end
