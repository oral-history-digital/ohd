class UserRegistration < ApplicationRecord
  include Workflow
  include ActionView::Helpers::TextHelper

  STATES = %w(unchecked checked registered postponed rejected)

  belongs_to :user_account

  has_many :user_registration_projects
  has_many :projects,
    through: :user_registration_projects

  validates_format_of :email,
                      :with => /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i,
                      :on => :create

  validates_uniqueness_of :email, :on => :create

  before_create :serialize_form_parameters

  scope :unchecked, -> { where('workflow_state IS NULL OR workflow_state = ?', 'unchecked') }

  scope :legit, -> { where('workflow_state = "checked" OR workflow_state = "registered"') }
  scope :wants_newsletter, -> { where('receive_newsletter = ?', true) }

  # fields expected for the user registration
  def self.define_registration_fields(fields)
    @@registration_fields = {}
    @@registration_field_names = []
    fields.each_with_index do |field, index|
      name = field.to_sym
      @@registration_field_names << name
      @@registration_fields[name] = { :mandatory => true }
    end
    @@registration_field_names.each do |field|
      next if [:email, :first_name, :last_name, :tos_agreement, :priv_agreement].include?(field)
      class_eval <<EVAL
              def #{field}
                @#{field}
              end

              def #{field}=(value)
                @#{field} = value
              end
EVAL
    end
  end

  def self.registration_field_names
    @@registration_field_names
  end

  def self.registration_fields
    @@registration_fields
  end

  define_registration_fields [
                               'appellation',
                               'first_name',
                               'last_name',
                               'email',
                               'gender',
                               'job_description',
                               'research_intentions',
                               'comments',
                               'organization',
                               'homepage',
                               'street',
                               'zipcode',
                               'city',
                               'country'
                             ] + (Project.has_newsletter ? ['receive_newsletter'] :[])

  def after_initialize
    (YAML::load(read_attribute(:application_info) || '') || {}).each_pair do |attr, value|
      self.send(attr.to_s + "=", value)
    end
    @skip_mail_delivery = false
  end

  workflow do
    state :unchecked do
      event :register,  :transitions_to => :checked
      event :reject,    :transitions_to => :rejected
      event :postpone,  :transitions_to => :postponed
    end
    state :checked do
      event :activate,  :transitions_to => :registered do
        halt if self.user_account.nil? || self.user_account.encrypted_password.blank?
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
    state :rejected do
      event :reactivate,  :transitions_to => :checked
    end
  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

  # Registers a UserAccount by generating a confirmation token
  def register
    create_account
    raise "Could not create a valid account for #{self.inspect}" unless self.user_account.valid?
    self.processed_at = Time.now
    save
    save_registration_data_and_user_data_to_user_account # TMP_TRANSITION: copies all attributes to user_account
  end

  def activate
    self.user_account.update_attribute :confirmed_at, Time.now
  end

  # Flags the account as deactivated
  def deactivate
    self.user_account.update_attribute(:admin, nil)
    self.user_account.deactivate!
  end

  # Flags the account as deactivated
  def remove
    self.user_account.update_attribute(:admin, nil)
    self.user_account.deactivate!
  end

  def reactivate
    if self.user_account.nil?
      # perform the usual registration
      self.register
    else
      self.user_account.reactivate!
      user_account.resend_confirmation_instructions
    end
  end

  # Expires the confirmation token
  def expire
    self.user_account.update_attribute(:confirmation_token, nil)
  end

  # Resends the E-Mail with the account information
  def resend_info
    unless checked?
      raise "Dieser Zugang ist nicht freigegeben worden (aktueller Stand: '#{I18n.t(workflow_state, :scope => 'workflow_states')}')"
    end
    user_account.resend_confirmation_instructions
  end

  def full_name
    [ self.first_name.to_s.capitalize, self.last_name.to_s.capitalize ].join(' ').strip
  end

  def updated_at
    (user_account && user_account.updated_at) || created_at
  end

  def form_parameters
    require 'yaml'
    form_parameters = YAML.load read_attribute(:application_info)
    form_parameters
  end

  def skip_mail_delivery!
    @skip_mail_delivery = true
  end

  def email=(mail)
    write_attribute :email, mail.to_s.strip.downcase
  end

  def user_attributes
    require 'yaml'
    YAML.load(read_attribute(:application_info)).stringify_keys
  end

  private

  def serialize_form_parameters
    serialized_form_params = {}
    yaml_fields = [:appellation, :gender, :job_description, :research_intentions, :comments, :organization, :homepage, :street, :zipcode, :city, :country]
    yaml_fields.each do |field|
      serialized_form_params[field] = self.send(field)
    end
    require 'yaml'
    self.application_info = serialized_form_params.to_yaml
  end

  def create_account
    self.user_account = UserAccount.where(email: self.email).first_or_initialize
    self.user_account.login = create_login if self.user_account.login.blank?
    self.user_account.generate_confirmation_token if self.user_account.confirmation_token.blank?
    self.user_account.save
  end

  def save_registration_data_and_user_data_to_user_account
    reg_attrs = self.attributes
    reg_attrs.delete('id')
    reg_attrs.delete('workflow_state')
    reg_attrs.delete('user_account_id')
    reg_attrs.delete('email') # user account already contains the email
    reg_attrs.delete('application_info') # we do not need the YAML field
    self.user_account.update_attributes(reg_attrs)
    user_attrs = user_attributes
    user_attrs.delete('id')
    user_attrs.delete('first_name') # names were taken from registrsation attrs
    user_attrs.delete('last_name')
    self.user_account.update_attributes(user_attrs)
  end

  def create_login
    ideal_login = first_name.first.strip.downcase.gsub(/\s/,'') + last_name.strip.downcase.gsub(/\s/,'')
    login = ideal_login
    # try email address if it's not too long and contains the last name
    try_email = (self.email.length < 20) && self.email.downcase.index(self.last_name.downcase)
    while UserAccount.where('login = ?', login).count > 0
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
