class CollectionSerializer < ApplicationSerializer
  attributes :id, :name, :institution, :homepage, :notes

  def name
    object.localized_hash
  end
end
