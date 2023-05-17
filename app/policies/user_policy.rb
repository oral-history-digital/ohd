class UserPolicy < ApplicationPolicy

  def show?
    user == record || user.admin?
  end

  def update?
    show?
  end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        users = scope.where.not(confirmed_at: nil)
        users = users.joins(:user_projects).where("user_projects.project_id = ?", project.id) if !project.is_ohd?
        users
      else
        scope.none
      end
    end
  end
end
