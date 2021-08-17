class RegistryEntryPolicy < ApplicationPolicy
  def merge?
    update?
  end

  def tree?
    index?
  end
end
