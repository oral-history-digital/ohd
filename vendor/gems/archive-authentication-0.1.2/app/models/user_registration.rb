class UserRegistration < ActiveRecord::Base
  include Workflow

  belongs_to :user_account

  validates_format_of :email,
                      :with => /^.+@.+\..+$/,
                      :on => :create

  validates_acceptance_of :tos_agreement, :accept => true

  before_create :serialize_form_parameters

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
      event :activate,  :transitions_to => :registered
      event :expire,    :transitions_to => :postponed
    end
    state :registered do
      event :deactivate,  :transitions_to => :postponed
      event :remove,      :transitions_to => :rejected
    end
    state :postponed do
      event :activate,    :transitions_to => :registered
      event :reject,      :transitions_to => :rejected
    end
    state :rejected
  end

  # Registers a UserAccount by generating a confirmation token
  def register
    create_account
    if self.user_account.valid?
      UserAccountMailer.deliver_account_activation_instructions(self, self.user_account)
    end
  end

  # Flags the account as deactivated
  def deactivate
    self.user_account.deactivate!
  end

  # Flags the account as deactivated
  def remove
    self.user_account.deactivate!
  end

  # Expires the confirmation token
  def expire
    self.user_account.update_attribute(:confirmation_token, nil)
  end

  def full_name
    [ self.first_name, self.last_name ].join(' ').strip
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
    self.user_account = UserAccount.new
    self.user_account.email = self.email
    self.user_account.login = create_login
    self.user_account.generate_confirmation_token
    self.user_account.save
  end

  def create_login
    ideal_login = first_name.first.downcase + last_name.downcase
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