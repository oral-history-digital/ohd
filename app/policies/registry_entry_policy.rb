class RegistryEntryPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def merge?
    update?
  end

end
