class Task < ApplicationRecord

  belongs_to :user_account, touch: true
  belongs_to :supervisor, class_name: 'UserAccount'
  belongs_to :task_type
  belongs_to :interview
  has_many :comments, as: :ref, dependent: :destroy

  validates_associated :interview

  before_save :send_mail_to_user_account

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
      event :restart, transitions_to: :started
    end
    state :cleared do
      event :restart, transitions_to: :started
    end
  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

  def send_mail_to_user_account
    if user_account_id_changed? && user_account_id != nil
      AdminMailer.with(task: self, receiver: user_account).task_assigned.deliver_now
    end
  end

  def finish
    AdminMailer.with(task: self, receiver: supervisor).task_finished.deliver_now if supervisor
  end

  def restart
    AdminMailer.with(task: self, receiver: user_account).task_restarted.deliver_now if user_account
  end

  def archive_id=(aid)
    i = Interview.find_by_archive_id(aid)
    i && self.interview_id = i.id
  end

end
