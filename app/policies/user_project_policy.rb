class UserProjectPolicy < ApplicationPolicy
  def create?
    user
  end

  def update?
    user && user.user_projects.include?(record)
  end
end
