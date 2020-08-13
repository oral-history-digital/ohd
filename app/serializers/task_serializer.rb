class TaskSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :user_account_id,
    :supervisor_id,
    :interview_id,
    :archive_id,
    :workflow_state,
    :workflow_states,
    :comments

  belongs_to :task_type

  def name
    "#{object.task_type.label}: #{object.interview.archive_id}"
  end

  def archive_id
    object.interview.archive_id
  end

  def comments
    object.comments.inject({}) { |mem, c| mem[c.id] = CommentSerializer.new(c); mem }
  end

end
