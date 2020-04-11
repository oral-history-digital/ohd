class ContributionSerializer < ApplicationSerializer
  attributes :id, 
    :contribution_type, 
    :person_id, 
    :interview_id,
    :workflow_states,
    :workflow_state
end
