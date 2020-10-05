class Task < ApplicationRecord

  belongs_to :user_account
  belongs_to :supervisor, class_name: 'UserAccount'
  belongs_to :task_type
  belongs_to :interview
  has_many :comments, as: :ref, dependent: :destroy

  validates_associated :interview

  before_save :save_dates_and_inform

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
      event :restart, transitions_to: :restarted
    end
    state :cleared do
      event :restart, transitions_to: :restarted
    end
    state :restarted do
      event :finish, transitions_to: :finished
    end
  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
    self.touch
  end

  def save_dates_and_inform
    if user_account_id_changed? && user_account_id != nil
      AdminMailer.with(task: self, receiver: user_account).task_assigned.deliver_now
      self.assigned_to_user_account_at = DateTime.now
      interview.touch
      user_account.touch
    end
    if supervisor_id_changed? && supervisor_id != nil
      self.assigned_to_supervisor_at = DateTime.now
      interview.touch
      supervisor.touch
    end
  end

  def start
    self.update_attributes(started_at: DateTime.now)
  end

  def finish
    AdminMailer.with(task: self, receiver: supervisor).task_finished.deliver_now if supervisor
    self.update_attributes(finished_at: DateTime.now)
  end

  def clear
    self.update_attributes(cleared_at: DateTime.now)
  end

  def restart
    AdminMailer.with(task: self, receiver: user_account).task_restarted.deliver_now if user_account
    self.update_attributes(restarted_at: DateTime.now)
  end

  def archive_id=(aid)
    i = Interview.find_by_archive_id(aid)
    i && self.interview_id = i.id
  end

end
