class User < ApplicationRecord
  include Workflow

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :confirmable,
         :recoverable,
         :trackable,
         :validatable

  has_many :sessions,
           class_name: 'ActiveRecord::SessionStore::Session',
           dependent: :delete_all

  has_many :access_tokens,
           class_name: 'Doorkeeper::AccessToken',
           foreign_key: :resource_owner_id,
           dependent: :delete_all

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :permissions, through: :roles

  has_many :tasks
  has_many :supervised_tasks,
           class_name: 'Task',
           foreign_key: :supervisor_id

  has_many :user_contents, dependent: :destroy
  has_many :searches, dependent: :destroy
  has_many :comments, foreign_key: :author_id, dependent: :destroy

  has_many :user_projects, dependent: :destroy
  has_many :projects,
    through: :user_projects

  #validates_uniqueness_of :login
  #validates_presence_of :login
  validates_uniqueness_of :email
  validates_presence_of :email
  validates_format_of :email, :with => Devise.email_regexp
  validates_length_of :password, :within => 5..50, :allow_blank => true

  scope :wants_newsletter, -> { where('receive_newsletter = ?', true) }

  workflow do
    state :created do
      event :confirm, :transitions_to => :confirmed
    end
    state :confirmed do
      event :block, :transitions_to => :blocked
    end
    state :blocked do
      event :revoke_block, :transitions_to => :confirmed
    end
  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

  def block
    # send email to user
    # revoke access to all projects
  end

  def revoke_block
    # send email to user
    # grant access to all projects
  end

  def projects
    user_projects.map(&:project)
  end

  def active_projects
    user_projects.where.not(activated_at: nil).map(&:project)
  end

  def accessible_projects
    user_projects.where(workflow_state: 'project_access_granted').map(&:project)
  end

  def all_tasks
    tasks | supervised_tasks
  end

  def task_permissions?(project, record, action_name)
    if record.respond_to?(:class_name)
      # on create record is just a class not an object
      # and we can not really check for interview_id
      # so trust the checking in the frontend :(
      #
      all_tasks.select{|t| t.interview.project_id == project.id}.
        map(&:permissions).flatten.uniq.
        find{|p| p.klass == record.class_name && p.action_name == action_name}
    else
      record_tasks = record.is_a?(Interview) ?
        all_tasks.select{|t| t.interview_id == record.id} :
        all_tasks.select{|t| t.interview_id == record.interview_id}
      record_tasks.map(&:permissions).flatten.uniq.
        find{|p| p.klass == record.class.name && p.action_name == action_name}
    end
  end

  def roles?(project, klass, action_name)
    project &&
    !roles.joins(:permissions).
      where(project_id: project.id).
      where("permissions.klass": klass, "permissions.action_name": action_name).
      blank?
  end

  def locale_with_project_fallback
    self.default_locale || self.projects.last.default_locale
  end

  def full_name
    [ self.first_name.to_s.capitalize, self.last_name.to_s.capitalize ].join(' ').strip
  end

  def display_name
    if !self.appellation.blank?
      [I18n.t("user.appellation.#{self.appellation}"), self.full_name].compact.join(' ')
    else
      self.full_name
    end
  end

end
