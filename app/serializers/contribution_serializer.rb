class ContributionSerializer < ApplicationSerializer
  attributes :id, 
    :contribution_type, 
    :contribution_type_id, 
    :person_id, 
    :interview_id,
    :speaker_designation,
    :workflow_states,
    :workflow_state

  def contribution_type
    object.contribution_type && object.contribution_type.code
  end
end
