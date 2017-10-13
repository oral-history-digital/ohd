class UserContentSerializer < ActiveModel::Serializer
  attributes :id,
    :description,
    :user_id,
    :title,
    :media_id,
    :interview_references,
    :properties,
    :reference_id, 
    :reference_type, 
    :type,
    :link_url,
    :persistent
end
