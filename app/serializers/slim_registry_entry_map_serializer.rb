class SlimRegistryEntryMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_types, :agg_names
  attribute :latitude, key: :lat
  attribute :longitude, key: :lon

  def agg_names
    JSON.parse(object.agg_names)
  end
end
