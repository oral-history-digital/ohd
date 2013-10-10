class User < ActiveRecord::Base

  require 'archive-authorization'

  attr_protected :admin

  belongs_to :user_account
  belongs_to :user_registration

  has_many :user_contents

  has_many :searches

  acts_as_authorized_user

  has_many  :user_groups,
            :through => :users_user_groups

  has_many  :supervised_groups,
            :class_name => 'UserGroup',
            :as => :supervisor

  has_many  :users_user_groups

  has_many  :user_roles,
            :class_name => 'Role'

  has_many  :group_roles,
            :class_name => 'Role',
            :through => :user_groups

  delegate  :email, :login,
            :to => :user_account

  after_save :refresh_roles

  # direct accessor for roles:
  ROLE_SELECT = 'SELECT roles.id, roles.name, roles.authorizable_type, roles.authorizable_id '

  # the join via the user_groups -> roles
  JOIN_VIA_GROUPS = <<-SQL
                      FROM roles
                      RIGHT JOIN user_groups ON user_groups.id = roles.user_group_id
                      RIGHT JOIN users_user_groups AS uug ON uug.user_group_id = user_groups.id
SQL

  # Roles accessor to have some form of "caching"
  def roles
    @roles ||=  Role.find_by_sql  ['(' + ROLE_SELECT + JOIN_VIA_GROUPS + \
                          '   WHERE uug.user_id = ?) ' + \
                          'UNION DISTINCT (' + ROLE_SELECT + 'FROM roles' \
                          '   WHERE roles.user_id = ?)', id, id ]
  end

  # Avoid roles memory effects.
  # This is an after save callback, but it's also
  # called from the Role model on create and
  # destroy of user roles.
  def refresh_roles
    @roles = nil
  end

  # Avoid roles memory effects.
  # Used as an association callback.
  def refresh_groups(group)
    refresh_roles
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
    user_account.email=(address)
  end

  def admin?
    read_attribute(:admin) == true
  end

  def tags
    Tag.for_user(self)
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
    UserAccount.find(:first, :conditions => conditions)
  end

end
