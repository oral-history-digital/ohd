class HelpTextPolicy < ApplicationPolicy
  def show?
    user.present?
  end

  def index?
    user.present?
  end

  def update?
    user.admin?
  end

  def create?
    false
  end

  def destroy?
    false
  end
end
