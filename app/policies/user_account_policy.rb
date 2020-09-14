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

  class Scope < Scope
    def resolve
      if user.admin? || user.user_roles.exists?
        (UserAccount.joins(:user_roles) | UserAccount.where(admin: true))
      else
        scope.none
      end
    end
  end
end
