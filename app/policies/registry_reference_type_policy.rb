class RegistryReferenceTypePolicy < ApplicationPolicy
  def global?
    index?
  end
end
