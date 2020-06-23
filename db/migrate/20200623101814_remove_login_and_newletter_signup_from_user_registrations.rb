class RemoveLoginAndNewletterSignupFromUserRegistrations < ActiveRecord::Migration[5.2]

  # newsletter_signup is not used anymore in zwar (set to true for only a dozen active entries ) -
  # it has been replaced by receive_newsletter
  # login has not been used since 2012 in zwar
  def self.up
    remove_columns :user_registrations, :login, :newsletter_signup
  end
  def self.down
    add_column :user_registrations, :login, :string
    add_column :user_registrations, :newsletter_signup, :boolean
  end
end
