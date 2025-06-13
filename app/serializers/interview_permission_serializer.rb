class InterviewPermissionSerializer < ApplicationSerializer
  attributes [
    :id,
    :name,
    :interview_id,
    :user_id,
  ]

  def name
    object.interview.archive_id
  end

end
