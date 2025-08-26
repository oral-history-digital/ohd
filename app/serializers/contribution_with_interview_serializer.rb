class ContributionWithInterviewSerializer < ApplicationSerializer
  attributes :id,
    :contribution_type,
    :contribution_type_id,
    :label,
    :interview_id,
    :interview_title,
    :person_id,
    :interview_id,
    :speaker_designation,
    :workflow_states,
    :workflow_state

  def contribution_type
    object.contribution_type&.code
  end

  def label
    object.contribution_type&.label
  end

  def interview_id
    object.interview&.archive_id
  end

  def interview_title
    object.interview&.anonymous_title
  end
end
