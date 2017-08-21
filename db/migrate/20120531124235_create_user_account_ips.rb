class CreateUserAccountIps < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    create_table :user_account_ips do |t|
      t.references :user_account
      t.string  :ip
      t.datetime :created_at
    end
    add_index :user_account_ips, [:user_account_id, :ip]
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_table :user_account_ips
  end
  end

end
