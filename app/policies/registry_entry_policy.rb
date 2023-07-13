class RegistryEntryPolicy < ApplicationPolicy
  def merge?
    update?
  end

  def tree?
    index?
  end

  def global_tree?
    index?
  end
end
