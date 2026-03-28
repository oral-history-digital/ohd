class Admin::InstanceSettingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user&.admin? ? scope.all : scope.none
    end
  end

  def show?
    user&.admin?
  end

  def update?
    user&.admin?
  end
end
