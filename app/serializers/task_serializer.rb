class TaskSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :user_id,
    :supervisor_id,
    :interview_id,
    :project_id,
    :archive_id,
    :interviewee,
    :workflow_state,
    :workflow_states,
    :assigned_to_user_at,
    :assigned_to_supervisor_at,
    :started_at,
    :finished_at,
    :cleared_at,
    :restarted_at,
    :comments,
    :permissions

  belongs_to :task_type

  def name
    object.task_type.localized_hash(:label)
  end

  def archive_id
    object.interview.archive_id
  end

  def project_id
    object.interview.project_id
  end

  def interviewee
    object.interview.localized_hash(:reverted_short_title)
  end

  def comments
    object.comments.inject({}) { |mem, c| mem[c.id] = CommentSerializer.new(c); mem }
  end

  def permissions
    object.permissions.inject({}) do |mem, p| 
      mem[p.id] = {
        name: p.name,
        desc: p.desc,
        klass: p.klass,
        action_name: p.action_name,
        interview_id: object.interview_id
      }
      mem
    end
  end

  [
    :assigned_to_user_at,
    :assigned_to_supervisor_at,
    :started_at,
    :finished_at,
    :cleared_at,
    :restarted_at
  ].each do |m|
    define_method m do
      date = object.send(m)
      date && date.strftime("%d.%m.%Y %H:%M")
    end
  end

end
