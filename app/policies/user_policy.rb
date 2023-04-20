class UserPolicy < ApplicationPolicy

  def show?
    user == record
  end

  def update?
    show?
  end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        if project.is_ohd?
          scope.where.not(confirmed_at: nil)
        else
          scope.joins(:user_projects).
            where("user_projects.project_id = ?", project.id).
            where.not(confirmed_at: nil)
        end
      else
        scope.none
      end
    end
  end
end
