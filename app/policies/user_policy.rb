class UserPolicy < ApplicationPolicy

  def show?
    user == record
  end

  def update?
    show?
  end

  #def confirm_new_email?
    #show?
  #end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        scope.joins(:user_projects).
          where("user_projects.project_id = ?", project.id).
          where.not(confirmed_at: nil)
      else
        scope.none
      end
    end
  end
end
