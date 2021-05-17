class RegistryReferencePolicy < ApplicationPolicy
  def map_references?
    index?
  end
end
