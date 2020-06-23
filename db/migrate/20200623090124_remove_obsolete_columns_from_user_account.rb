class RemoveObsoleteColumnsFromUserAccount < ActiveRecord::Migration[5.2]
  # all columns are empty in zwar
  def self.up
    remove_columns :user_accounts, :remember_created_at, :remember_token
  end
  def self.down
    add_column :user_accounts, :remember_created_at, :datetime
    add_column :user_accounts, :remember_token, :string
  end
end
