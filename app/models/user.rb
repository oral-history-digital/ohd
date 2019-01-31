class User < ActiveRecord::Base

  require 'user_account'
  #require 'archive-authorization'

  belongs_to :user_account
  belongs_to :user_registration

  has_many :user_contents

  has_many :searches

  #acts_as_authorized_user

  has_many :user_roles
  has_many :roles, through: :user_roles
  has_many :permissions, through: :roles

  has_many :tasks
  has_many :supervised_tasks,
           class_name: 'Task',
           as: :supervisor

  delegate :email, :login,
           :to => :user_account

  def tasks?(record)
    !tasks.where(authorized: record).where.not(workflow_state: 'finished').blank? #||
    #!supervised_tasks.where(authorized: record).blank?
  end

  def permissions?(controller, action)
    !permissions.where(controller: controller, action: action).blank?
  end

  def roles?(controller, action)
    !roles.joins(:permissions).where("permissions.controller": controller, "permissions.action": action).blank?
  end

  def to_s
    [ first_name, last_name ].compact.join(' ')
  end

  def zipcity
    "#{zipcode} #{city}"
  end

  def zipcity=(str)
    self.zipcode = (str[/^\s*\d+/] || '').strip
    self.city = str.sub(zipcode, '').strip
  end

  def email=(address)
    user_account.update_attribute :email, address
    user_account.reload
    user_registration.update_attribute :email, address
    user_registration.reload
  end

  def admin?
    read_attribute(:admin) == true
  end

  def tags
    Tag.for_user(self) unless Tag.nil?
  end

  # Authenticate a user based on configured attribute keys. Returns the
  # authenticated user if it's valid or nil.
  def authenticate(attributes={})
    return unless Devise.authentication_keys.all? { |k| attributes[k].present? }
    conditions = attributes.slice(*Devise.authentication_keys)
    auth_proxy = find_for_authentication(conditions)
    auth_proxy.user if auth_proxy.try(:valid_for_authentication?, attributes)
  end

  private

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
    UserAccount.where(conditions).first
  end

end
