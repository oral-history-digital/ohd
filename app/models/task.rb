class Task < ApplicationRecord

  belongs_to :user_account
  belongs_to :supervisor, class_name: 'UserAccount'
  belongs_to :authorized, polymorphic: true

  include Workflow

  workflow do
    state :created do
      event :start, transition_to: :started
    end
    state :started do
      event :finish, transitions_to: :finished
      event :ask_supervisor, transition_to: :question_to_supervisor
    end
    state :question_to_supervisor do
      event :answer_question, transitions_to: :answered
    end
    state :answered do
      event :finish, transitions_to: :finished
      event :ask_supervisor, transition_to: :question_to_supervisor
    end
  end

  def workflow_states
    Task.workflow_spec.states.keys
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

end
