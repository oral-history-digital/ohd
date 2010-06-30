class UserAccount < AuthenticationModel
  unloadable

  devise :database_authenticatable,
         # handle Confirmations less automatically
         # :confirmable,
         :rememberable,
         :recoverable,
         :trackable

  has_one :user

  has_one :user_registration

  attr_accessible :email, :login, :password, :password_confirmation, :remember_me

  validates_uniqueness_of :login
  validates_presence_of :login
  validates_uniqueness_of :email
  validates_presence_of :email
  validates_format_of :email, :with => Devise::EMAIL_REGEX
  validates_confirmation_of :password
  validates_length_of       :password, :within => 5..20, :allow_blank => true
  

  def generate_confirmation_token
    self.confirmation_token = Devise.friendly_token
    self.confirmation_sent_at = Time.now.utc
  end

  def display_name
    self.reload.user_registration.nil? ? self.login : [self.user_registration.appellation, self.user_registration.full_name].compact.join(' ')
  end

  def admin?
    !self.user.blank? # && self.user.admin?
  end

  # METHODS FROM CONFIRMABLE:

  # Find a user by it's confirmation token and try to confirm it.
  # If no user is found, returns a new user with an error.
  # If the user is already confirmed, create an error for the user
  # Options must have the confirmation_token
  def self.confirm_by_token(confirmation_token)
    confirmable = find_or_initialize_with_error_by(:confirmation_token, confirmation_token)
    confirmable.confirm! unless confirmable.new_record?
    confirmable
  end

  # Confirm a user by setting it's confirmed_at to actual time. If the user
  # is already confirmed, add en error to email field
  def confirm!
    unless_confirmed do
      self.confirmation_token = nil
      self.confirmed_at = Time.now
      self.deactivated_at = nil
      self.user_registration.activate! unless self.user_registration.nil?
      save(false)
    end
  end

  # Verifies whether a user is confirmed or not
  def confirmed?
    !new_record? && !confirmed_at.nil?
  end

  # Overwrites active? from Devise::Models::Activatable for confirmation
  # by verifying whether an user is active to sign in or not. If the user
  # is already confirmed, it should never be blocked. Otherwise we need to
  # calculate if the confirm time has not expired for this user.
  def active?
    super && (confirmed? || confirmation_period_valid?) && !deactivated?
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

  # If you don't want confirmation to be sent on create, neither a code
  # to be generated, call skip_confirmation!
  def skip_confirmation!
    self.confirmed_at  = Time.now
    @skip_confirmation = true
  end

  protected

  # Checks if the confirmation for the user is within the limit time.
  # We do this by calculating if the difference between today and the
  # confirmation sent date does not exceed the confirm in time configured.
  # Confirm_in is a model configuration, must always be an integer value.
  #
  # Example:
  #
  #   # confirm_within = 1.day and confirmation_sent_at = today
  #   confirmation_period_valid?   # returns true
  #
  #   # confirm_within = 5.days and confirmation_sent_at = 4.days.ago
  #   confirmation_period_valid?   # returns true
  #
  #   # confirm_within = 5.days and confirmation_sent_at = 5.days.ago
  #   confirmation_period_valid?   # returns false
  #
  #   # confirm_within = 0.days
  #   confirmation_period_valid?   # will always return false
  #
  def confirmation_period_valid?
    confirmation_sent_at && confirmation_sent_at.utc >= self.class.confirm_within.ago
  end

  # Checks whether the record is confirmed or not, yielding to the block
  # if it's already confirmed, otherwise adds an error to email.
  def unless_confirmed
    unless confirmed?
      yield
    else
      self.class.add_error_on(self, :email, :already_confirmed)
      false
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
    find(:first, :conditions => conditions)
  end

end