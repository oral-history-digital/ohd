class AddRegistrationColumnsToUserAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :user_accounts, :priv_agreement, :boolean
    add_column :user_accounts, :tos_agreement, :boolean
    add_column :user_accounts, :receive_newsletter, :boolean
    add_column :user_accounts, :default_locale, :string
    add_column :user_accounts, :workflow_state, :string
    add_column :user_accounts, :admin_comments, :text
    add_column :user_accounts, :processed_at, :datetime
    add_column :user_accounts, :activated_at, :datetime
  end
end
