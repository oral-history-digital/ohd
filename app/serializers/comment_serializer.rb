class CommentSerializer < ApplicationSerializer
  attributes :id, 
    :author_id,
    :receiver_id,
    :ref_id,
    :ref_type,
    :interview_id,
    :text,
    :created_at,
    :name

  def name
    "#{object.text && object.text[0..50]}... , #{object.created_at.strftime("%d.%m.%Y %H:%M")} #{object.author.full_name}"
  end

  def created_at
    object.created_at.strftime("%d.%m.%Y %M:%H")
  end

end
