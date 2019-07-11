class UserAccountSerializer < ApplicationSerializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name,
    :user_id,
    #:organization,
    #:homepage,
    #:street,
    #:zipcode,
    #:city,
    #:state,
    #:country,
    #:receive_newsletter,
    #:newsletter_signup,
    :admin,
    :tasks,
    :supervised_tasks,
    :user_roles,
    :permissions

  def first_name
    object.user && object.user.first_name
  end

  def last_name
    object.user && object.user.last_name
  end

  def admin
    object.user && object.user.admin
  end

  def user_id
    object.user.id
  end

  def user_roles
    object.user ? object.user.user_roles.inject({}){|mem, c| mem[c.id] = UserRoleSerializer.new(c); mem} : {}
  end

  def tasks
    object.user ? object.user.tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem} : {}
  end

  def supervised_tasks
    object.user ? object.user.supervised_tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem} : {}
  end

  def permissions
    object.user ? object.user.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem} : {}
  end

end
