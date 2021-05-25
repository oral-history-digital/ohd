class RegistryEntryPolicy < ApplicationPolicy
  def merge?
    update?
  end

  def tree?
    index?
  end

  def map?
    index?
  end
end
