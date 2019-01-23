class RoleSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :desc,
    #:permissions,
    :role_permissions,
    :created_at

  #def permissions
    #object.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  #end

  def role_permissions
    object.role_permissions.inject({}){|mem, c| mem[c.id] = RolePermissionSerializer.new(c); mem}
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

end
