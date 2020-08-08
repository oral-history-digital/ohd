class CommentSerializer < ApplicationSerializer
  attributes :id, 
    :author_id,
    :receiver_id,
    :ref_id,
    :ref_type,
    :text,
    :created_at,
    :name

  def name
    "#{object.text[0..15]}... , #{object.created_at.strftime("%d.%m.%Y %H:%M")} #{object.author.full_name}"
  end

end
