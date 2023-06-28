class Admin::UserPolicy < ApplicationPolicy

  def show?
    user.admin?
  end

  def flag?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.roles?(project, 'User', 'update'))
        users = scope.where.not(confirmed_at: nil)
        users = users.joins(:user_projects).where("user_projects.project_id = ?", project.id) if !project.is_ohd?
        users
      else
        scope.none
      end
    end
  end
end
