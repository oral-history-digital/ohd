class SlimRegistryReferenceTypeMapSerializer < ActiveModel::Serializer
  attribute :id
  attribute :label, key: :name
  attribute :map_color, key: :color
end
