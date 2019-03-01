class TaskSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :desc,
    :authorized_type,
    :authorized_id,
    :user_id,
    :supervisor_id,
    :workflow_state,
    :transitions_to

  def transitions_to
    object.current_state.events.map{|e| e.first}
  end

  def authorized_type
    object.authorized_type.underscore
  end

end
