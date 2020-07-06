class UserAccountSerializer < ApplicationSerializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name,
    :user_account_id,
    #:organization,
    #:homepage,
    #:street,
    #:zipcode,
    #:city,
    #:country,
    #:receive_newsletter,
    :admin,
    :tasks,
    :supervised_tasks,
    :user_roles,
    :permissions,
    :project_ids

  def user_account_id
    object.id
  end

  def user_roles
    object.user_roles.inject({}){|mem, c| mem[c.id] = UserRoleSerializer.new(c); mem}
  end

  def tasks
    object.tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem}
  end

  def supervised_tasks
    object.supervised_tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem}
  end

  def permissions
    object.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  end

  def project_ids
    #object.user_registration.user_registration_projects.where.not(activated_at: nil).map{|urp| urp.project.identifier}
  end

end
