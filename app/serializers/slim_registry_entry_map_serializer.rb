class SlimRegistryEntryMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_types, :name
  attribute :latitude, key: :lat
  attribute :longitude, key: :lon
end
