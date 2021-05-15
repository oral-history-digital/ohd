class UserRoleSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :desc,
    :project_id,
    :role_permissions#,
    #:permissions,
    #:created_at

  #def permissions
    #object.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  #end

  def name
    object.role.name
  end

  def desc 
    object.role.desc
  end

  def project_id
    object.role.project_id
  end

  def role_permissions
    object.role.role_permissions.inject({}){|mem, c| mem[c.id] = RolePermissionSerializer.new(c); mem}
  end

  #def created_at
    #object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M Uhr')
  #end

end
