class UsersUserGroup < ActiveRecord::Base

  belongs_to :user_group
  belongs_to :user

  validates_uniqueness_of :user_id, :scope => :user_group_id
  validates_presence_of :user_id, :user_group_id

  after_create  :refresh_user_groups_user_roles
  after_destroy :refresh_user_groups_user_roles

  private

  # Refreshes the in-memory cache of user roles
  # after user-user_group assignment deassignment
  def refresh_user_groups_user_roles
    unless user.nil?
      user.reload
      user.refresh_roles
    end
  end

end