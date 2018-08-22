class AnnotationSerializer < ActiveModel::Serializer
  attributes :id, :text, :author_id, :author

  def text
    object.localized_hash
  end

  def author
    #object.read_attribute(:author) || ''
  end

end
