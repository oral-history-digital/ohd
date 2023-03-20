class RenameUserAccountsToUsers < ActiveRecord::Migration[7.0]
  def change
    drop_table :users
    rename_table :user_accounts, :users
    remove_column :users, :anonymized, :boolean
  end
end
