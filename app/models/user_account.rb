require 'devise'

class UserAccount < ApplicationRecord

  devise :database_authenticatable,
         :confirmable,
         :recoverable,
         :trackable

  has_one :user_registration, dependent: :destroy

  has_many :user_account_ips,
           :class_name => 'UserAccountIp'

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

  validates_uniqueness_of :login
  validates_presence_of :login
  validates_uniqueness_of :email
  validates_presence_of :email
  validates_format_of :email, :with => Devise.email_regexp
  validates_length_of :password, :within => 5..50, :allow_blank => true

  def projects
    user_registration.user_registration_projects.map(&:project)
  end

  def active_projects
    user_registration.user_registration_projects.where.not(activated_at: nil).map(&:project)
  end

  def accessible_projects
    user_registration.user_registration_projects.where(workflow_state: 'project_access_granted').map(&:project)
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

  # NOTE: validates_confirmation_of won't work on virtual attributes!
  # This is why we add a custom validation method later.
  # validates_confirmation_of :password

  # password confirmation validation
  def validate
    unless password.blank?
      if password_confirmation.blank?
        errors.add(:password_confirmation, :blank)
      elsif !password_confirmation.eql?(password)
        errors.add(:password, :confirmation)
      end
    end
  end

  def generate_confirmation_token
    self.confirmation_token = Devise.friendly_token
    self.confirmation_sent_at = Time.now.utc
  end

  # FIXME: we have legacy users which do not have a default_locale
  # for now, fallback to project - alternatively cleanup the data
  def locale_with_project_fallback
    self.default_locale || self.user_registration.projects.last.default_locale
  end

  def full_name
    [ self.first_name.to_s.capitalize, self.last_name.to_s.capitalize ].join(' ').strip
  end

  def display_name
    if !self.user_registration.appellation.blank?
      [I18n.t("user_registration.appellation.#{self.user_registration.appellation}"), self.user_registration.full_name].compact.join(' ')
    else
      self.user_registration.full_name
    end
  end

  # METHODS FROM CONFIRMABLE:

  # self.confirm_by_token: not used.

  # Cornfirms the password in two cases:
  # - for newly registered users
  # - when resetting the password
  # - when reactivating users
  # For newly registered user, we store the confirmation time and perform a workflow step in the registration workflow
  def confirm_with_password!(password, password_confirmation)
    reset_password(password, password_confirmation)
    unless_confirmed do
      self.confirmation_token = nil
      self.confirmed_at = Time.now
      self.deactivated_at = nil
      # theoretically we do not need this check, but unfortunately we have some legacy accounts without UserRegistration
      unless self.user_registration.nil?
        self.user_registration.update activated_at: Time.now
        self.user_registration.projects.each do |project|
          AdminMailer.with(registration: self, project: project).new_registration_info.deliver_now
        end
      end
      save(validate: false)
    end
  end

  # Verifies whether a user is confirmed or not
  def confirmed?
    !new_record? && !confirmed_at.nil?
  end

  # Overwrites active? from Devise::Models::Activatable for confirmation
  # by verifying whether a user is active to sign in or not. If the user
  # is already confirmed, it should never be blocked. Otherwise we need to
  # calculate if the confirm time has not expired for this user.
  def active?
    (confirmed? || confirmation_period_valid?) && !deactivated?
  end

  # The message to be shown if the account is inactive.
  def inactive_message
    !deactivated? ? :deactivated : (!confirmed? ? :unconfirmed : super)
  end

  def deactivated?
    !self.deactivated_at.blank?
  end

  def deactivate!
    self.deactivated_at = Time.now
    save
  end

  def reactivate!
    # remove all current password info,
    # regenerate a confirmation_token and
    # reset deactivated_at
    self.encrypted_password = ''
    self.password_salt = ''
    self.generate_confirmation_token
    self.deactivated_at = nil
    self.confirmed_at = nil
    self.confirmation_sent_at = Time.now
    save
  end

  # If you don't want confirmation to be sent on create, neither a code
  # to be generated, call skip_confirmation!
  def skip_confirmation!
    self.confirmed_at  = Time.now
    @skip_confirmation = true
  end

  #
  # overwritten from devise
  #
  # Attempt to find a user by its email. If a record is found, send new
  # password instructions to it. If user is not found, returns a new user
  # with an email not found error.
  # Attributes must contain the user's email
  def self.send_reset_password_instructions(attributes={}, opts={})
    recoverable = find_or_initialize_with_errors(reset_password_keys, attributes, :not_found)
    recoverable.send_reset_password_instructions(opts) if recoverable.persisted?
    recoverable
  end

  #
  # overwritten from devise
  #
  # Resets reset password token and send reset password instructions by email.
  # Returns the token sent in the e-mail.
  def send_reset_password_instructions(opts={})
    token = set_reset_password_token
    send_reset_password_instructions_notification(token, opts)

    token
  end

  protected

  # We don't use the Devise confirmation period. Instead we just
  # check that the account was confirmed in the past.
  def confirmation_period_valid?
    !confirmed_at.nil? && confirmed_at < (Time.now + 1.minute)
  end

  # Checks whether the record is confirmed or not, yielding to the block
  # if it's already confirmed, otherwise adds an error to email.
  # It also stops on any validation errors.
  def unless_confirmed
    if confirmed?
      errors.add(:email, :already_confirmed)
      false
    else
      # valid? is not sufficient here!
      #if !valid?
      if !errors.empty?
        false
      else
        yield
      end
    end
  end

  # Find first record based on conditions given (ie by the sign in form).
  # Overwrite to add customized conditions, create a join, or maybe use a
  # namedscope to filter records while authenticating.
  # Example:
  #
  #   def self.find_for_authentication(conditions={})
  #     conditions[:active] = true
  #     find(:first, :conditions => conditions)
  #   end
  #
  def find_for_authentication(conditions)
    conditions[:deactivated_at] = nil
    where(conditions).first
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login_string = conditions.delete(:login)
      where(["lower(login) = :value OR lower(email) = :value", { :value => login_string.downcase }]).first
    elsif conditions.has_key?(:email)
      where(conditions.to_hash).first
    end
  end

  #
  # overwritten from devise
  #
  def send_reset_password_instructions_notification(token, opts={})
    send_devise_notification(:reset_password_instructions, token, opts)
  end

end
