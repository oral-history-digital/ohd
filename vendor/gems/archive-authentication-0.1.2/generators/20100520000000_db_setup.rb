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
    end
    add_index :user_accounts, :confirmation_token, :unique => true
    add_index :user_accounts, :login, :unique => true
    add_index :user_accounts, :reset_password_token, :unique => true

    create_table :authenticatables do |t|
      t.string :authentication_realm, :null => false
      t.integer :authenticatable_id
      t.integer :user_account_id
    end
    add_index :authenticatables, [ :authentication_realm, :user_account_id ], :name => 'index_authenticatables_on_user_account'
    add_index :authenticatables, [ :authentication_realm, :authenticatable_id ], :name => 'index_authenticatables_on_authentication_realm_objects'

  end

  def self.down

    drop_table :user_accounts
    drop_table :authenticables
    
  end

end