class UserAccountSerializer < ApplicationSerializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name,
    :user_account_id,
    :admin,
    :tasks,
    :supervised_tasks,
    :user_roles,
    :permissions,
    :user_registration_projects,
    :access_token

  has_one :user_registration

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

  def user_registration_projects
    object.user_registration && object.user_registration.user_registration_projects.inject({}){|mem, c| mem[c.id] = UserRegistrationProjectSerializer.new(c); mem}
  end

  def access_token
    last_access_token = object.access_tokens.last
    last_access_token && last_access_token.token
  end
end
