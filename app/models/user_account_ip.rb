class UserAccountIp < ActiveRecord::Base

  belongs_to :user_account

  validates_presence_of :ip
  validates_uniqueness_of :ip, :scope => :user_account_id

end