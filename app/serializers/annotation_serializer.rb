class AnnotationSerializer < ApplicationSerializer
  attributes :id, 
    :text, 
    :author_id, 
    :author,
    :interview_id

  def text
    object.localized_hash(:text)
  end

  def author
    #object.read_attribute(:author) || ''
  end

end
