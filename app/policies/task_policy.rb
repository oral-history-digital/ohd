class TaskPolicy < ApplicationPolicy

  def create?
    user.admin?
  end

  def new?
    create?
  end

  def update?
    record.user_account == user || record.supervisor == user.permissions || user.admin?
  end

  def edit?
    update?
  end

  def destroy?
    create?
  end

  class Scope < Scope
    def resolve
      #scope.where(user: user).or.where(supervisor: user)
      scope.all
    end
  end
end
