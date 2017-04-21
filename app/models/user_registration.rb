class UserRegistration < ActiveRecord::Base
  include Workflow
  include ActionView::Helpers::TextHelper

  STATES = %w(unchecked checked registered postponed rejected)

  belongs_to :user_account

  has_one :user, :dependent => :destroy

  validates_format_of :email,
                      :with => /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i,
                      :on => :create

  validates_uniqueness_of :email, :on => :create

  validates_acceptance_of :tos_agreement, :accept => true
  validates_acceptance_of :priv_agreement, :accept => true

  before_create :serialize_form_parameters

  scope :unchecked, -> { where('workflow_state IS NULL OR workflow_state = ?', 'unchecked') }

  # fields expected for the user registration
  def self.define_registration_fields(fields)
    @@registration_fields = {}
    @@registration_field_names = []
    raise "Invalid user_registration_fields for User: type #{fields.class.name}, expected Array" unless fields.is_a?(Array)
    fields.each_with_index do |field, index|
      case field
        when Hash
          name = field[:name].to_s.to_sym
          @@registration_field_names << name
          @@registration_fields[name] = { :position => index,
                                          :mandatory => field[:mandatory].nil? ? true : field[:mandatory],
                                          :type => field[:type] || :string,
                                          :translate => field[:translate].nil? ? true : field[:translate],
                                          :values => field[:values] || [] }
        else
          name = field.to_s.to_sym
          @@registration_field_names << name
          @@registration_fields[name] = { :position => index,
                                          :mandatory => true,
                                          :translate => true,
                                          :type => :string,
                                          :values => [] }
      end
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
                                 { :name => 'appellation',
                                   :values => [  'Frau',
                                                 'Herr',
                                                 'Frau Dr.',
                                                 'Herr Dr.',
                                                 'Frau PD Dr.',
                                                 'Herr PD Dr.',
                                                 'Frau Prof.',
                                                 'Herr Prof.' ] },
                                 'first_name',
                                 'last_name',
                                 'email',
                                 { :name => 'job_description',
                                   :values => [  'Dozentin/Dozent',
                                                 'Filmemacherin/Filmemacher',
                                                 'Journalistin/Journalist',
                                                 'Lehrerin/Lehrer',
                                                 'Mitarbeiterin/Mitarbeiter (Museen/Gedenkstätten)',
                                                 'Schülerin/Schüler',
                                                 'Studentin/Student',
                                                 'Sonstiges'],
                                   :mandatory => false },
                                 { :name => 'research_intentions',
                                   :values => [ 'Ausstellung',
                                                'Bildungsarbeit',
                                                'Dissertation',
                                                'Dokumentarfilm',
                                                'Familienforschung',
                                                'Kunstprojekt',
                                                'Persönliches Interesse',
                                                'Schulprojekt/Referat',
                                                'Universitäre Lehre',
                                                'Wissenschaftliche Publikation',
                                                'Pressepublikation',
                                                'Sonstiges' ] },
                                 { :name => 'comments',
                                   :type => :text },
                                 { :name => 'organization',
                                   :mandatory => false },
                                 { :name => 'homepage',
                                   :mandatory => false },
                                 'street',
                                 'zipcode',
                                 'city',
                                 { :name => 'state',
                                   :mandatory => false,
                                   :values => [  'Bayern',
                                                 'Baden-Württemberg',
                                                 'Saarland',
                                                 'Hessen',
                                                 'Rheinland-Pfalz',
                                                 'Nordrhein-Westfalen',
                                                 'Niedersachsen',
                                                 'Thüringen',
                                                 'Sachsen-Anhalt',
                                                 'Sachsen',
                                                 'Brandenburg',
                                                 'Berlin',
                                                 'Mecklenburg-Vorpommern',
                                                 'Hamburg',
                                                 'Bremen',
                                                 'Schleswig-Holstein',
                                                 'außerhalb Deutschlands' ]},
                                 { :name => 'country',
                                   :type => :country }
                             ] + (Project.has_newsletter ? [{ :name => 'receive_newsletter', :mandatory => false, :type => :boolean }] : [])

  def after_initialize
    (YAML::load(read_attribute(:application_info) || '') || {}).each_pair do |attr, value|
      self.send(attr.to_s + "=", value)
    end
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
        halt if self.user_account.nil? || self.user_account.encrypted_password.blank? || self.user_account.password_salt.blank?
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

  # Registers a UserAccount by generating a confirmation token
  def register
    create_account
    raise "Could not create a valid account for #{self.inspect}" unless self.user_account.valid?
    initialize_user
    raise "Could not create a valid user for #{self.inspect}" unless self.user.valid?
    self.processed_at = Time.now
    save
    unless @skip_mail_delivery
      UserAccountMailer.deliver_account_activation_instructions(self.user_account)
    end
  end

  def activate
    update_attribute :activated_at, Time.now
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
    if self.user_account.nil?
      # perform the usual registration
      self.register
    else
      self.user_account.reactivate!
      if self.user_account.valid? and !@skip_mail_delivery
        UserAccountMailer.deliver_account_activation_instructions(self.user_account)
      end
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
    user_account.generate_confirmation_token if user_account.confirmation_token.blank?
    user_account.confirmation_sent_at = Time.now
    user_account.save
    UserAccountMailer.deliver_account_activation_instructions(self.user_account)
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

  # fix for attribute name mismatch in registration info... *sigh*
  def send_newsletter=(flag)
    write_attribute :receive_newsletter, flag
  end

  def send_newsletter
    read_attribute :receive_newsletter
  end

  def receive_newsletter?
    case receive_newsletter
      when true, false
        receive_newsletter
      when String
        receive_newsletter.to_i > 0
      when Numeric
        receive_newsletter > 0
      else
        false
    end
  end

  private

  def serialize_form_parameters
    serialized_form_params = {}
    (UserRegistration.registration_field_names - [:email, :first_name, :last_name, :tos_agreement, :priv_agreement]).each do |field|
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
      user.user_account_id = self.user_account.id
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
    # make sure each field is short enough for the DB columns (240 char limit)
    user_attr = {}
    attr.each_pair do |k,v|
      user_attr[k] = truncate(v, :length => 240)
    end
    user_attr
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
