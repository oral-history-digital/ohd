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
    :workflow_state 

  def reference_id
    if object.is_a? UserAnnotation
      #Interview.find_by_archive_id(object.properties[:interview_archive_id]).segments[object.properties[:segmentIndex]].id
      object.properties[:segmentIndex]
    else
      object.reference_id
    end
  end
    
end
