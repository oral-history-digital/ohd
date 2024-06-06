class UserContentSerializer < ApplicationSerializer
  attributes :id,
    :description,
    :user_id,
    :project_id,
    :title,
    :media_id,
    :properties,
    :reference_id,
    :reference_type,
    :type,
    :shared,
    :workflow_state,
    :created_at,
    :updated_at

  def reference_id
    if object.is_a? UserAnnotation
      #Interview.find_by_archive_id(object.properties[:interview_archive_id]).segments[object.properties[:segmentIndex]].id
      object.properties[:segmentIndex]
    else
      object.reference_id
    end
  end

end
