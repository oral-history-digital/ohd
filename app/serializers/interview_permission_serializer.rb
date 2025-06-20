class InterviewPermissionSerializer < ApplicationSerializer
  attributes [
    :id,
    :name,
    :interview_id,
    :archive_id,
    :user_id,
    :project_id,
  ]

  def name
    object.interview.archive_id
  end

  def archive_id
    object.interview.archive_id
  end

  def project_id
    object.interview.project_id
  end
end
