class DbSetup < ActiveRecord::Migration
  def self.up

    create_table :user_accounts do |t|
      t.database_authenticatable
      t.recoverable
      t.confirmable
      t.rememberable
      t.recoverable
      t.trackable
      t.validatable
      t.string :login
      t.datetime :deactivated_at
    end
    add_index :user_accounts, :login, :unique => true
    add_index :user_accounts, [ :login, :deactivated_at ]

  end

  def self.down

    drop_table :user_accounts
    
  end

end