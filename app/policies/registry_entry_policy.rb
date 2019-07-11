class RegistryEntryPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def merge?
    user.admin? || user.permissions?(record.class.name, :update) || user.tasks?(record) 
  end

end
