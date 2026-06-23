class UserRoleSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :archive_management,
    :desc,
    :project_id,
    :project_shortname,
    :project_name,
    :role_permissions#,
    #:permissions,
    #:created_at

  #def permissions
    #object.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  #end

  def name
    object.role.name
  end

  def archive_management
    object.role.translations.any? do |translation|
      translation.name == 'Archivmanagement'
    end
  end

  def desc 
    object.role.desc
  end

  def project_id
    object.role.project_id
  end

  def project_shortname
    object.role.project.shortname
  end

  def project_name
    object.role.project.name
  end

  def role_permissions
    object.role.role_permissions.inject({}){|mem, c| mem[c.id] = RolePermissionSerializer.new(c); mem}
  end

  #def created_at
    #object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M Uhr')
  #end

end
