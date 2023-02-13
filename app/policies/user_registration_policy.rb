class UserRegistrationPolicy < ApplicationPolicy

  #def new?
    #true
  #end

  #def create?
    #new?
  #end

  #def activate?
    #new?
  #end

  #def confirm?
    #new?
  #end

  def show?
    user.admin?
  end

  def subscribe?
    user.admin?
  end

  def unsubscribe?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        if project.shortname == 'ohd'
          scope.all.
            where.not(user_account_id: nil).
            where.not(activated_at: nil)
        else
          scope.joins(:user_registration_projects).
            where("user_registration_projects.project_id = ?", project.id).
            where.not(user_account_id: nil).
            where.not(activated_at: nil)
        end
      else
        scope.none
      end
    end
  end
end
