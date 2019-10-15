class CollectionSerializer < ApplicationSerializer
  attributes :id, :name, :institution, :homepage

  def name
    object.localized_hash
  end
end
