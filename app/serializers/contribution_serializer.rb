class ContributionSerializer < ApplicationSerializer
  attributes :id, 
    :contribution_type, 
    :person_id, 
    :interview_id,
    :speaker_designation,
    :workflow_states,
    :workflow_state
end
