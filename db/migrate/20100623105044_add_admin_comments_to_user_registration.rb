class AddAdminCommentsToUserRegistration < ActiveRecord::Migration

  def self.up

    change_table :user_registrations do |t|
      t.string  :admin_comments
      t.integer :user_account_id
      t.string :login
      t.remove :approved_at
      t.datetime  :processed_at
    end

    change_table  :users do |t|
      t.integer :user_account_id
      t.integer :user_registration_id
    end
    add_index :users, :user_account_id

  end

  def self.down
    remove_column :user_registrations, :admin_comments
    remove_column :user_registrations, :user_account_id
    remove_column :user_registrations, :login
    remove_column :user_registrations, :processed_at
    add_column  :user_registrations, :approved_at, :datetime

    remove_column :users, :user_account_id
    remove_column :users, :user_registration_id
  end
  
end
