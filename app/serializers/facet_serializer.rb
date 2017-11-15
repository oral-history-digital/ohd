class FacetSerializer < ActiveModel::Serializer
  attributes :id,
             :descriptor

  def descriptor
    #object.respond_to? :localized_hash ? object.localized_hash : object.to_s
    object.localized_hash
  end

end
