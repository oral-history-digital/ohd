class TaskSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :desc,
    :user_account_id,
    :supervisor_id,
    :workflow_state,
    :workflow_states,
    :comments

  belongs_to :task_type

  def comments
    object.comments.inject({}) { |mem, c| mem[c.id] = CommentSerializer.new(c); mem }
  end

end
