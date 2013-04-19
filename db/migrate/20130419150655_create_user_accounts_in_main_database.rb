class CreateUserAccountsInMainDatabase < ActiveRecord::Migration

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

    require 'yaml'
    auth_settings = ENV['RAILS_ENV'] == 'test' ? 'authentication_test' : 'authentication'
    db_conf = YAML::load_file(File.join(RAILS_ROOT, 'config/database.yml'))[auth_settings]

    puts "\nPlease import a DB dump of user_account data from the '#{db_conf['database']}' database NOW.\n"
  end

  def self.down
    drop_table :user_accounts
  end

end
