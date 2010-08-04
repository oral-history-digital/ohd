class RemoveAuthenticatables < ActiveRecord::Migration

  def self.up
    begin
      drop_table :authenticatables
    rescue
    end
  end

  def self.down
    # Don't actually re-create the table, it was never used
    #create_table :authenticatables do |t|
    #  t.string :authentication_realm, :null => false
    #  t.integer :user_id
    #  t.integer :user_account_id
    #end
    #add_index :authenticatables, [ :authentication_realm, :user_account_id ], :name => 'index_authenticatables_on_user_account'
    #add_index :authenticatables, [ :authentication_realm, :user_id ], :name => 'index_authenticatables_on_authentication_realm_objects'
  end

end
