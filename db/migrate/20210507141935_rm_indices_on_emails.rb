class RmIndicesOnEmails < ActiveRecord::Migration[5.2]
  def change
    remove_index :user_accounts, :login
    remove_index :user_registrations, :email
  end
end
