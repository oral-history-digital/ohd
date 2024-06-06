class TaskPolicy < ApplicationPolicy

  def create?
    user.admin?
  end

  def new?
    create?
  end

  def update?
    user && (
      user.admin? ||
      user.roles?(project, 'Task', 'update') ||
      record.user == user ||
      record.supervisor == user.permissions
    )
  end

  def edit?
    update?
  end

  def destroy?
    create?
  end

end
