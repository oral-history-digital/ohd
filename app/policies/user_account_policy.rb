class UserAccountPolicy < ApplicationPolicy

  def show?
    user == record
  end

  def update?
    show?
  end

  def confirm_new_email?
    show?
  end

  def access_token?
    show?
  end

  class Scope < Scope
    def resolve
      if user.admin? || user.user_roles.exists? || user.tasks.exists? || user.supervised_tasks.exists?
        scope.joins(user_registration: :user_registration_projects).where("user_registration_projects.project_id = ?", project.id).joins(:user_roles) |
          scope.joins(user_registration: :user_registration_projects).where("user_registration_projects.project_id = ?", project.id).where(admin: true) |
          scope.joins(user_registration: :user_registration_projects).where("user_registration_projects.project_id = ?", project.id).joins(:tasks) |
          scope.joins(user_registration: :user_registration_projects).where("user_registration_projects.project_id = ?", project.id).joins(:supervised_tasks)
      else
        scope.none
      end
    end
  end
end
