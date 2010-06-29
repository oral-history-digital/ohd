class AddDefaultLocaleToUserRegistrations < ActiveRecord::Migration

  def self.up
    change_table :user_registrations do |t|
      t.string :default_locale
      t.boolean :receive_newsletter
    end

    # switch to AUTHENTICATION
    @options = AuthenticationModel::DB_CONFIG.dup.merge({:charset => 'utf8', :collation => 'utf8_unicode_ci'})
    ActiveRecord::Base.establish_connection(@options)
    change_table :user_accounts do |t|
      t.datetime :deactivated_at
    end

    ActiveRecord::Base.establish_connection
  end

  def self.down
    remove_column :user_registrations, :default_locale
    remove_column :user_registrations, :receive_newsletter

    # switch to AUTHENTICATION
    @options = AuthenticationModel::DB_CONFIG.dup.merge({:charset => 'utf8', :collation => 'utf8_unicode_ci'})
    ActiveRecord::Base.establish_connection(@options)
    remove_column :user_accounts, :deactivated_at
    
    ActiveRecord::Base.establish_connection
  end
  
end
