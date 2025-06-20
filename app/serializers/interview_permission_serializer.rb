class InterviewPermissionSerializer < ApplicationSerializer
  attributes [
    :id,
    :name,
    :action_name,
    :interview_id,
    :archive_id,
    :user_id,
    :project_id,
  ]

  def name
    object.interview.archive_id
  end

  def action_name
    # It is always 'show' for interview permissions (now)
    'show'
  end

  def archive_id
    object.interview.archive_id
  end

  def project_id
    object.interview.project_id
  end
end
