class UserProjectSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :user_id,
    :workflow_state,
    :workflow_states,
    :admin_comments,
    :receive_newsletter,
    :job_description,
    :research_intentions,
    :specification,
    :organization,
    :activated_at,
    :processed_at,
    :terminated_at,
    :updated_at,
    :created_at

  def activated_at
    object.activated_at && object.activated_at.strftime("%d.%m.%Y")
  end

  def created_at
    object.created_at.to_f * 1000
  end

end
