class RemoveAddedColumnsFromUserAccount < ActiveRecord::Migration[5.2]
  def self.up
    remove_columns :user_accounts, :user_account_id, :user_registration_id, :workflow_state
  end
  def self.down
    add_column :user_accounts, :user_account_id, :integer
    add_column :user_accounts, :user_registration_id, :integer
    add_column :user_accounts, :workflow_state, :string
  end
end
