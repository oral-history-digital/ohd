class UserRegistration < ActiveRecord::Base
  include Workflow

  STATES = %w(unchecked checked registered postponed rejected)

  belongs_to :user_account

  has_one :user, :dependent => :destroy

  validates_format_of :email,
                      :with => /^.+@.+\..+$/,
                      :on => :create

  validates_acceptance_of :tos_agreement, :accept => true

  before_create :serialize_form_parameters

  named_scope :unchecked, :conditions => ['workflow_state IS NULL OR workflow_state = ?', 'unchecked']

  def after_initialize
    @skip_mail_delivery = false
  end

  def validate
    unless registered?
      # Sadly, people were registered even without matching the minimum required fields...
      # ... so we need to cease checking for already registered people.
      self.class.registration_field_names.select{|f| self.class.registration_fields[f.to_sym][:mandatory] }.each do |field|
        if self.send(field).blank?
          errors.add(field, "Angaben zu #{field} fehlen.")
        end
      end
    end
    if unchecked?
      missing_fields = self.class.registration_field_names - self.class.registration_field_names.compact
      unless missing_fields.empty?
        errors.add_to_base("Angaben zu #{missing_fields.join(', ')} fehlen.")
      end
    end
  end

  workflow do
    state :unchecked do
      event :register,  :transitions_to => :checked
      event :reject,    :transitions_to => :rejected
      event :postpone,  :transitions_to => :postponed
    end
    state :checked do
      event :activate,  :transitions_to => :registered do
        halt if self.user_account.nil? || !self.user_account.confirmed?
      end
      event :expire,    :transitions_to => :postponed
    end
    state :registered do
      event :remove,      :transitions_to => :rejected
    end
    state :postponed do
      event :reactivate,  :transitions_to => :checked
      event :reject,      :transitions_to => :rejected
    end
    state :rejected
  end

  # Registers a UserAccount by generating a confirmation token
  def register
    create_account
    initialize_user
    if self.user_account.valid? and !@skip_mail_delivery
      UserAccountMailer.deliver_account_activation_instructions(self, self.user_account)
    end
  end

  # Flags the account as deactivated
  def deactivate
    self.user.update_attribute(:admin, nil)
    self.user_account.deactivate!
  end

  # Flags the account as deactivated
  def remove
    self.user.update_attribute(:admin, nil)
    self.user_account.deactivate!
  end

  def reactivate
    self.user_account.reactivate!
  end

  # Expires the confirmation token
  def expire
    self.user_account.update_attribute(:confirmation_token, nil)
  end

  def full_name
    [ self.first_name, self.last_name ].join(' ').strip
  end

  def form_parameters
    require 'yaml'
    form_parameters = YAML.load read_attribute(:application_info)
    form_parameters
  end

  def skip_mail_delivery!
    @skip_mail_delivery = true
  end

  private

  def serialize_form_parameters
    serialized_form_params = {}
    (User.registration_field_names - [:email, :first_name, :last_name, :tos_agreement]).each do |field|
      serialized_form_params[field.to_sym] = self.send(field)
    end
    require 'yaml'
    self.application_info = serialized_form_params.to_yaml
  end

  def create_account
    self.user_account = UserAccount.find_or_initialize_by_email(self.email)
    self.user_account.login = create_login if self.user_account.login.blank?
    self.user_account.generate_confirmation_token if self.user_account.confirmation_token.blank?
    self.user_account.save
  end

  def initialize_user
    if self.user.blank?
      user = self.build_user
      user.attributes = user_attributes
      user.first_name = self.first_name
      user.last_name = self.last_name
      user.user_account_id = self.user_account_id
      user.tos_agreed_at = self.created_at || Time.now if User.content_columns.map(&:name).include?('tos_agreed_at')
      user.save!
    elsif !self.user_account.nil?
      self.user.update_attributes(user_attributes)
      self.user.user_account = self.user_account
      self.user.save
    end
  end

  def user_attributes
    require 'yaml'
    attr = YAML.load(read_attribute(:application_info)).stringify_keys
    user_columns = User.content_columns.map(&:name) & attr.keys
    attr.delete_if{|k,v| !user_columns.include?(k) }
    attr
  end

  def create_login
    ideal_login = first_name.first.strip.downcase.gsub(/\s/,'') + last_name.strip.downcase.gsub(/\s/,'')
    login = ideal_login
    # try email address if it's not too long and contains the last name
    try_email = (self.email.length < 20) && self.email.downcase.index(self.last_name.downcase)
    while UserAccount.count(:all, :conditions => ['login = ?', login]) > 0
      if try_email
        login = self.email
        try_email = false
      else
        login = ideal_login + ((login[/\d+$/] || '1').to_i + 1).to_s
      end
    end
    login
  end

end