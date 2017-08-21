class AddAdminCommentsToUserRegistration < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :eog

=begin
    # This was merged into the archive-authentication migration
    # for user_registrations
    change_table :user_registrations do |t|
      t.string  :admin_comments
      t.integer :user_account_id
      t.string :login
      t.remove :approved_at
      t.datetime  :processed_at
    end
=end

    change_table  :users do |t|
      t.integer :user_account_id
      t.integer :user_registration_id
    end
    add_index :users, :user_account_id

  #end
  end

  def self.down
  #unless Project.name.to_sym == :eog
=begin
    remove_column :user_registrations, :admin_comments
    remove_column :user_registrations, :user_account_id
    remove_column :user_registrations, :login
    remove_column :user_registrations, :processed_at
    add_column  :user_registrations, :approved_at, :datetime
=end

    remove_column :users, :user_account_id
    remove_column :users, :user_registration_id
  #end
  end
  
end
