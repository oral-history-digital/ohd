class AnnotationSerializer < ApplicationSerializer
  attributes :id,
    :text,
    :author_id,
    :author,
    :interview_id,
    :segment_id

  def author
    #object.read_attribute(:author) || ''
  end

end
