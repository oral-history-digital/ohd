class RolePermissionSerializer < ApplicationSerializer
  attributes :id,
    :role_id,
    :permission_id,
    :name,
    :desc,
    :klass,
    :action_name,
    :created_at

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

  [
    :name,
    :desc,
    :klass,
    :action_name
  ].each do |att|
    define_method att do 
      object.permission.send(att)
    end
  end

end
