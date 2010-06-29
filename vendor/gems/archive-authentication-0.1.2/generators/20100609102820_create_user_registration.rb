class CreateUserRegistration < ActiveRecord::Migration

  def self.up

    create_table :user_registrations do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.boolean :tos_agreement
      t.boolean :receive_newsletter
      t.text :application_info
      t.string :workflow_state
      t.string :default_locale
      t.datetime :created_at
      t.datetime :approved_at
      t.datetime :activated_at
    end
    add_index :user_registrations, :email
    add_index :user_registrations, :workflow_state
    add_index :user_registrations, [ :workflow_state, :email ]

  end

  def self.down

    drop_table :user_registrations

  end

end
