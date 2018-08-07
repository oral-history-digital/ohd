class RegistryReferenceTypeSerializer < ActiveModel::Serializer
  attributes :id,
             :name

  def name
    object.localized_hash
  end

end
