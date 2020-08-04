class Task < ApplicationRecord

  belongs_to :user_account
  belongs_to :supervisor, class_name: 'UserAccount'
  belongs_to :task_type
  belongs_to :interview
  has_many :comments, as: :ref, dependent: :destroy

  include Workflow

  workflow do
    state :created do
      event :start, transition_to: :started
    end
    state :started do
      event :finish, transitions_to: :finished
    end
    state :finished do
      event :clear, transitions_to: :cleared
    end
    state :cleared do
      event :restart, transitions_to: :started
    end
  end

  def workflow_states
    Task.workflow_spec.states.keys
  end

  #def workflow_state=(change)
    #self.send("#{change}!")
  #end

end
