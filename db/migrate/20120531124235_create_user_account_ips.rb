class CreateUserAccountIps < ActiveRecord::Migration

  def self.up
    create_table :user_account_ips do |t|
      t.references :user_account
      t.string  :ip
      t.datetime :created_at
    end
    add_index :user_account_ips, [:user_account_id, :ip]
  end

  def self.down
    remove_table :user_account_ips
  end

end
