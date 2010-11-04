class Role < ActiveRecord::Base

  belongs_to :user_group
  belongs_to :user
  belongs_to :authorizable,
             :polymorphic => true

  # belongs either to a user_group (normally) or an individual user
  validates_inclusion_of :user_group_id, :in => [nil], :unless => Proc.new{|i| i.user_id.nil? }, :message => 'Cannot belong to a user_group if already belonging to a user'
  validates_inclusion_of :user_id, :in => [nil], :unless => Proc.new{|i| i.user_group_id.nil? }, :message => 'Cannot belong to a user if already belonging to a user_group'

  after_create  :refresh_associated_user_roles
  after_destroy :refresh_associated_user_roles

  private

  # Refreshes the in-memory cache of user roles
  def refresh_associated_user_roles
    unless user.nil?
      user.refresh_roles
    end
    unless user_group.nil?
      user_group.users.each do |user|
        user.refresh_roles
      end
    end
  end
  
end