class UserRegistrationProjectSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :user_registration_id,
    :workflow_state,
    :workflow_states,
    :admin_comments,
    :activated_at,
    :processed_at,
    :terminated_at,
    :updated_at,
    :created_at

  def activated_at
    object.activated_at && object.activated_at.strftime("%d.%m.%Y %H:%M")
  end
end
