class Task < ApplicationRecord

  belongs_to :user
  belongs_to :supervisor, class_name: 'User'
  belongs_to :task_type
  has_many :permissions, through: :task_type
  belongs_to :interview, touch: true
  has_many :comments, as: :ref, dependent: :destroy

  validates_associated :interview
  validates_uniqueness_of :task_type_id, :scope => [:interview_id]

  before_save :save_dates_and_inform

  include Workflow

  # every state should be possible from all others
  # workflow is still in here only  because of the callbacks
  #
  workflow do
    state :created do
      event :start, transition_to: :started
      event :finish, transitions_to: :finished
      event :clear, transitions_to: :cleared
      event :restart, transitions_to: :restarted
    end
    state :started do
      event :start, transition_to: :started
      event :finish, transitions_to: :finished
      event :clear, transitions_to: :cleared
      event :restart, transitions_to: :restarted
    end
    state :finished do
      event :start, transition_to: :started
      event :finish, transitions_to: :finished
      event :clear, transitions_to: :cleared
      event :restart, transitions_to: :restarted
    end
    state :cleared do
      event :start, transition_to: :started
      event :finish, transitions_to: :finished
      event :clear, transitions_to: :cleared
      event :restart, transitions_to: :restarted
    end
    state :restarted do
      event :start, transition_to: :started
      event :finish, transitions_to: :finished
      event :clear, transitions_to: :cleared
      event :restart, transitions_to: :restarted
    end
  end

  def workflow_states
    current_state.events.map{|e| e.first}
    #%w(created started finished cleared restarted)
  end

  def workflow_state=(change)
    self.send("#{change}!")
    self.touch
  end

  def save_dates_and_inform
    if user_id_changed? && user_id != nil
      AdminMailer.with(task: self, receiver: user).task_assigned.deliver_now
      self.assigned_to_user_at = DateTime.now
      interview.touch
      user.touch
    end
    if supervisor_id_changed? && supervisor_id != nil
      self.assigned_to_supervisor_at = DateTime.now
      interview.touch
      supervisor.touch
    end
  end

  def start
    self.update(started_at: DateTime.now)
  end

  def finish
    AdminMailer.with(task: self, receiver: supervisor).task_finished.deliver_now if supervisor
    self.update(finished_at: DateTime.now)
  end

  def clear
    self.update(cleared_at: DateTime.now)
  end

  def restart
    AdminMailer.with(task: self, receiver: user).task_restarted.deliver_now if user
    self.update(restarted_at: DateTime.now)
  end

  def archive_id=(aid)
    i = Interview.find_by_archive_id(aid)
    i && self.interview_id = i.id
  end

end
