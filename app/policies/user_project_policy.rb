class UserProjectPolicy < ApplicationPolicy
  def create?
    user
  end

  def update?
    user && (user.user_projects.include?(record) || user.admin? ||
             user.roles?(project, 'UserProject', 'update'))
  end

end
