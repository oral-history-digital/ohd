class AnnotationSerializer < ApplicationSerializer
  attributes :id,
    :text,
    :author_id,
    :author,
    :interview_id,
    :segment_id

  def text
    object.translations.inject({}) do |mem, t|
      mem[t.locale] = t.text
      mem
    end
  end

  def author
    #object.read_attribute(:author) || ''
  end

end
