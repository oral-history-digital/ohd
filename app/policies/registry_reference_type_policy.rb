class RegistryReferenceTypePolicy < ApplicationPolicy
  def map_reference_types?
    index?
  end
end
