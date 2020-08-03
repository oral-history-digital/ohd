class CommentSerializer < ApplicationSerializer
  attributes :id, 
    :author_id,
    :receiver_id,
    :ref_id,
    :ref_type,
    :text
end
