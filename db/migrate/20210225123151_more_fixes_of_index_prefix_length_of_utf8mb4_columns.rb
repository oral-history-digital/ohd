class MoreFixesOfIndexPrefixLengthOfUtf8mb4Columns < ActiveRecord::Migration[5.2]
  def up
    remove_index :user_accounts, :confirmation_token
    add_index :user_accounts, :confirmation_token, name: "index_user_accounts_on_confirmation_token",
              unique: true, length: 191

    remove_index :user_accounts, :login
    add_index :user_accounts, :login, name: "index_user_accounts_on_login", unique: true, length: 191

    remove_index :user_accounts, :reset_password_token
    add_index :user_accounts, :reset_password_token, name: "index_user_accounts_on_reset_password_token",
              unique: true, length: 191
  end

  def down
    remove_index :user_accounts, :confirmation_token
    add_index :user_accounts, :confirmation_token, name: "index_user_accounts_on_confirmation_token",
              unique: true

    remove_index :user_accounts, :login
    add_index :user_accounts, :login, name: "index_user_accounts_on_login", unique: true

    remove_index :user_accounts, :reset_password_token
    add_index :user_accounts, :reset_password_token, name: "index_user_accounts_on_reset_password_token",
              unique: true
  end
end
