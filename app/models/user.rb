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

  def after_database_authentication
    if !confirmed?
      resend_confirmation_instructions
    else
      Doorkeeper::AccessToken.create!(resource_owner_id: self.id)
    end
  end

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

  validates_uniqueness_of :email
  validates_presence_of :email
  validates_format_of :email, :with => Devise.email_regexp
  validates_length_of :password, :within => 5..50, :allow_blank => true
  validates :first_name, presence: true, length: { minimum: 2 }, allow_blank: false
  validates :last_name, presence: true, length: { minimum: 2 }, allow_blank: false
  validates :country, presence: true, length: { minimum: 2 }, allow_blank: false
  validates :street, presence: true, length: { minimum: 2 }, allow_blank: false
  validates :city, presence: true, length: { minimum: 2 }, allow_blank: false
  validates :priv_agreement, acceptance: { accept: true }
  validates :tos_agreement, acceptance: { accept: true }

  workflow do
    state :created do
      event :confirm, :transitions_to => :confirmed
    end
    state :confirmed do
      event :block, :transitions_to => :blocked
      # pseudo
      event :remove, :transitions_to => :removed
    end
    state :blocked do
      event :revoke_block, :transitions_to => :confirmed
      # pseudo
      event :remove, :transitions_to => :removed
    end
    state :removed
  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  rescue ActiveRecord::ActiveRecordError => e
  end

  def block
    subject = I18n.t('devise.mailer.block.subject', locale: self.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(self, {subject: subject, project: Project.ohd}).deliver_later(wait: 5.seconds)
    access_tokens.destroy_all
    sessions.destroy_all
  end

  def revoke_block
    subject = I18n.t('devise.mailer.revoke_block.subject', locale: self.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(self, {subject: subject, project: Project.ohd}).deliver_later(wait: 5.seconds)
  end

  def remove
    subject = I18n.t('devise.mailer.remove.subject', locale: self.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(self, {subject: subject, project: Project.ohd}).deliver_later(wait: 5.seconds)
    RemoveUserJob.set(wait: 10.seconds).perform_later(self.id)
  end

  def projects
    user_projects.map(&:project)
  end

  def active_projects
    user_projects.where.not(activated_at: nil).map(&:project)
  end

  def accessible_projects
    user_projects.where(workflow_state: 'project_access_granted').map(&:project) +
      Project.where(grant_project_access_instantly: true).
      or(Project.where(grant_access_without_login: true))
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

  def locale_with_project_fallback(project = nil)
    self.default_locale || project&.default_locale || self.projects.last&.default_locale || :de
  end

  def full_name
    [ self.first_name, self.last_name ].join(' ').strip
  end

  def display_name
    if !self.appellation.blank?
      [I18n.t("user.appellation.#{self.appellation}"), self.full_name].compact.join(' ')
    else
      self.full_name
    end
  end

  def active_for_authentication?
    super && !blocked?
  end

  def inactive_message
    !blocked? ? super : :blocked
  end

  def self.send_reset_password_instructions(attributes = {}) 
    recoverable = find_or_initialize_with_errors(reset_password_keys, attributes, :not_found)
    if recoverable.persisted? && attributes[:from]
      recoverable.pre_register_location = attributes[:from].gsub("?checked_ohd_session=true", "")
      recoverable.save(validate: false)
      recoverable.send_reset_password_instructions
    end
    recoverable
  end
end
