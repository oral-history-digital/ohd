class CollectionSerializer < ApplicationSerializer
  attributes :id, :name

  def name
    object.localized_hash
  end

end
