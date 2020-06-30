require 'devise'

class UserAccount < ApplicationRecord

  devise :database_authenticatable,
         :confirmable,
         :recoverable,
         :trackable

  has_one :user
  has_many :tasks, through: :user
  has_many :supervised_tasks, through: :user

  has_one :user_registration

  has_many :user_account_ips,
           :class_name => 'UserAccountIp'

  has_many :user_roles
  has_many :roles, through: :user_roles
  has_many :permissions, through: :roles

  has_many :tasks
  has_many :supervised_tasks,
           class_name: 'Task',
           foreign_key: :supervisor_id

  validates_uniqueness_of :login
  validates_presence_of :login
  validates_uniqueness_of :email
  validates_presence_of :email
  validates_format_of :email, :with => Devise.email_regexp
  validates_length_of :password, :within => 5..50, :allow_blank => true

  def tasks?(record)
    !tasks.where(authorized: record).where.not(workflow_state: 'finished').blank? #||
    #!supervised_tasks.where(authorized: record).blank?
  end

  def permissions?(klass, action_name)
    !permissions.where(klass: klass, action_name: action_name).blank?
  end

  def roles?(klass, action_name)
    !roles.joins(:permissions).where("permissions.klass": klass, "permissions.action_name": action_name).blank?
  end

  # NOTE: validates_confirmation_of won't work on virtual attributes!
  # This is why we add a custom validation method later.
  # validates_confirmation_of :password

  # we need something like that here....
  #workflow do
  #  state :unchecked do
  #    event :register,  :transitions_to => :registered
  #  end
  #  state :registered do
  #    event :activate,  :transitions_to => :active_project
  #    event :reject,    :transitions_to => :rejected
  #    event :postpone,  :transitions_to => :postponed
  #  end
  #  state :active_project do
  #    event :remove,      :transitions_to => :rejected
  #  end
  #  state :postponed do
  #    event :reactivate,  :transitions_to => :active_project
  #    event :reject,      :transitions_to => :rejected
  #  end
  #end

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

  def full_name
    [ self.first_name.to_s.capitalize, self.last_name.to_s.capitalize ].join(' ').strip
  end

  def display_name
    [self.appellation, self.user_registration.full_name].compact.join(' ')
  end

  # METHODS FROM CONFIRMABLE:

  # self.confirm_by_token: not used.

  # Confirm a user by setting it's confirmed_at to current time. If the user
  # is already confirmed, add en error to email field.
  # Additionally, we require passwords for confirming the account.
  def confirm_with_password!(password, password_confirmation)
    reset_password(password, password_confirmation)
    unless_confirmed do
      self.confirmation_token = nil
      self.confirmed_at = Time.now
      self.deactivated_at = nil

      unless self.user_registration.nil?
        self.user_registration.activate! if self.user_registration.checked? || self.user_registration.postponed?
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

end
