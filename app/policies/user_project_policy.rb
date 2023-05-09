class UserProjectPolicy < ApplicationPolicy
  def create?
    user
  end

  def update?
    user && (user.user_projects.include?(record) || user.admin? ||
             user.roles?(project, resolve_class_name(record), m))
  end

end
