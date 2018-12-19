class Admin::UserRegistrationPolicy < ApplicationPolicy

  def show?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        []
      end
    end
  end
end
