class SlimRegistryReferenceMapSerializer < ActiveModel::Serializer
  attributes :id, :registry_reference_type_id, :archive_id, :first_name, :last_name
end
