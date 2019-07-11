class Admin::UserPolicy < ApplicationPolicy

  def show?
    user.admin?
  end

  def flag?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.where(admin: true).order(last_name: :asc)
      else
        scope.none
      end
    end
  end
end
