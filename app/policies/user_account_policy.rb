class UserAccountPolicy < ApplicationPolicy

  def show?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin? || user.user_roles.exists?
        scope.joins(:user_roles).distinct.or(scope.joins(:user_roles).where(admin: true).distinct)
      else
        scope.none
      end
    end
  end
end
