class RegistryEntrySerializer < ActiveModel::Serializer
  attributes :id,
             :descriptor

  def descriptor
    object.to_s
  end

end
