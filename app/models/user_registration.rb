class UserRegistration < ApplicationRecord
  include Workflow
  include ActionView::Helpers::TextHelper

  STATES = %w(account_created account_confirmed project_access_granted project_access_postponed rejected account_deactivated)

  belongs_to :user_account

  has_many :user_registration_projects
  has_many :projects,
    through: :user_registration_projects

  validates_format_of :email,
                      :with => /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i,
                      :on => :create

  validates_uniqueness_of :email, :on => :create

  validates_acceptance_of :tos_agreement, :accept => true
  validates_acceptance_of :priv_agreement, :accept => true

  before_create :serialize_form_parameters

  scope :legit, -> { where('workflow_state = "project_access_granted"') }
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

    #   former workflow:
    # 1. user fills out registration form => :unchecked
    # 2. admin registers the user which leads to the state 'checked'  => Welcome+Activation-Email
    #     admin rejects => Rejection-Email
    # 3. user clicks on activation link which leads to the state 'registered'

    # new workflow
    # 1. user fills out registration form => :account_created => Activation-Email
    # 2. user opts in => :account_confirmed
    # 3. admin activates_project => :project_access_granted  => Welcome-Email
    #     admin rejects => Rejection-Email

    # revoking access
    # a) remove access to project (can be granted again) => TOS-Violation-EMAIL
    # b) deactivate account (can be reactivated) => Account-Deactivated-EMAIL
    # c) delete account (only Super-Admin?) => Account-Deleted-EMAIL?

    # legacy data
    # 1. registered accounts are migrated to :project_access_granted
    #    accounts should be validated and fixed
    #   (we have 1900 UserAccounts which are registered but not activated,
    #    1965 confirmation tokens which did not expire properly)
    # 2. all other accounts are :deleted (anonymized).
    #    We keep the following data:
    #     - for statistics: job_description, research_intentions, country, gender
    #     - [for admin purposes (security, trolling): email, admin_comments] to be discussed
    #    Users accounts checked or unchecked in the last 7 days are asked to register again due to changed registration process
    # associated data: ip, usage report

  workflow do

    # self-service step - not editable in UI
    state :account_created do
      event :confirm_account, :transition_to => :account_confirmed
      event :expire_confirmation_token, :transition_to => :confirmation_token_expired
    end
    # admin workflow
    state :account_confirmed do
      event :grant_project_access, :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :postpone_project_access,  :transitions_to => :project_access_postponed
    end
    state :project_access_granted do
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :postpone_project_access,  :transitions_to => :project_access_postponed
      event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_postponed do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_rejected do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :postpone_project_access,  :transitions_to => :project_access_postponed
      event :deactivate_account,        :transitions_to => :account_deactivated
    end
    state :account_deactivated do
      event :reactivate_account, :transitions_to => :account_created
    end

  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

  # Registers a UserAccount by generating a confirmation token
  # additionally copies registration data to user account (during transition to new registration process)
  def register
    create_account
    raise "Could not create a valid account for #{self.inspect}" unless self.user_account.valid?
    self.processed_at = Time.now
    self.default_locale = I18n.locale
    save
    # FIXME: copies all attributes to user_account. this duplicates data and has to be removed after the new registration process is finished
    save_registration_data_and_user_data_to_user_account
  end

  def confirm_account
    # this is triggered from user account to update the workflow state
    AdminMailer.with(registration: self, project: current_project).new_registration_info.deliver
    self.update!
  end

  # TODO: check how the token expires
  def expire_confirmation_token
    self.user_account.update_attribute(:confirmation_token, nil)
  end

  def grant_project_access
    self.update_attribute(:activated_at, Time.now)
    self.user_registration_projects.find_by_project_id(current_project).update_attribute(:activated_at, Time.now)
    # FIXME: why is self.default_locale always 'de'? we use user_account.default_locale for now
    subject = I18n.t('devise.mailer.project_access_granted.subject', project_name: current_project.name(self.user_account.locale_with_project_fallback), locale: self.user_account.locale_with_project_fallback)
    CustomDeviseMailer.project_access_granted(self.user_account, {subject: subject}).deliver_now
  end

  def reject_project_access
    # FIXME: why is self.default_locale always 'de'? we use user_account.default_locale for now
    subject = I18n.t('devise.mailer.project_access_rejected.subject', project_name: current_project.name(self.user_account.locale_with_project_fallback), locale: self.user_account.locale_with_project_fallback)
    CustomDeviseMailer.project_access_rejected(self.user_account, {subject: subject}).deliver_now
  end

  # Flags the account as deactivated and removes project access
  def deactivate_account
    project = self.user_registration_projects.find_by_project_id(current_project)
    self.user_registration_projects.find_by_project_id(current_project).update_attribute(:activated_at, nil) unless project.nil?
    self.user_account.update_attribute(:admin, nil)
    self.user_account.deactivate!
    # FIXME: why is self.default_locale always 'de'? we use user_account.default_locale for now
    subject = I18n.t('devise.mailer.account_deactivated.subject', project_name: current_project.name(self.user_account.locale_with_project_fallback), locale: self.user_account.locale_with_project_fallback)
    CustomDeviseMailer.account_deactivated(self.user_account, {subject: subject}).deliver_now
  end

  def reactivate_account
    self.user_account.reactivate!
    # FIXME: devise confirmation instructions uses I18n.locale for the email subject - to prevent this, we could use a custom template
    user_account.resend_confirmation_instructions
  end

  def full_name
    [ self.first_name.to_s.capitalize, self.last_name.to_s.capitalize ].join(' ').strip
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

  def update!
    update_attribute(:updated_at, Time.now)
  end

  private

  # FIXME: get project from params instead
  def current_project
    Project.last
  end

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
    self.user_account.tos_agreed_at = DateTime.now
    self.user_account.default_locale = I18n.locale
    self.user_account.save
  end

  def save_registration_data_and_user_data_to_user_account
    reg_attrs = self.attributes
    reg_attrs.delete('id')
    reg_attrs.delete('email')
    reg_attrs.delete('application_info') # we do not need the YAML field
    reg_attrs.delete('user_account_id')
    reg_attrs.delete('workflow_state')
    self.user_account.update_attributes(reg_attrs)
    user_attrs = user_attributes
    user_attrs.delete('id')
    user_attrs.delete('first_name') # names were taken from registration attrs
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
