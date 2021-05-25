class SlimRegistryReferenceTypeMapSerializer < ActiveModel::Serializer
  attribute :id
  attribute :label, key: :name
end
