class RegistryEntryPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user ? scope.all : scope.none
    end
  end

  def merge?
    update?
  end

end
