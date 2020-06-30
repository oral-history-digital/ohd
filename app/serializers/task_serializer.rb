class TaskSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :desc,
    :authorized_type,
    :authorized_id,
    :user_account_id,
    :supervisor_id,
    :workflow_state,
    :workflow_states

  def authorized_type
    object.authorized_type
  end

end
