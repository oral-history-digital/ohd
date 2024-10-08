class RenameUserAccountsToUsers < ActiveRecord::Migration[7.0]
  def change
    UserRegistration.where(user_account_id: nil).each do |user_registration|
      user_registration.create_account
      user_registration.save_registration_data_and_user_data_to_user_account
    end
    drop_table :users
    rename_table :user_accounts, :users
    remove_column :users, :anonymized, :boolean
  end
end
