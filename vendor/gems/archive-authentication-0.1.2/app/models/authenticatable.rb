class Authenticatable < AuthenticationModel

  belongs_to :user_account
  belongs_to :user

  # only one representation of the user account as UserModel
  # in one authentication_realm
  validates_uniqueness_of :user_account_id,
                          :scope => :authentication_realm

  # only one representation of the UserModel within one
  # authentication realm
  validates_uniqueness_of :user_id,
                          :scope => :authentication_realm

end