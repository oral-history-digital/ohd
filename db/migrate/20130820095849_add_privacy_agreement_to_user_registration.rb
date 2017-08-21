class AddPrivacyAgreementToUserRegistration < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    add_column :user_registrations, :priv_agreement, :boolean, :default => false
  else
    create_table :user_registrations do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.boolean :tos_agreement
      t.text :application_info
      t.string :workflow_state
      t.string :admin_comments
      t.integer :user_account_id
      t.string :login
      t.datetime :processed_at
      t.string :default_locale
      t.boolean :receive_newsletter
      t.boolean :newsletter_signup
      t.boolean :priv_agreement
      t.timestamps
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :user_registrations, :priv_agreement
  else
    drop_table :user_registrations
  end
  end
end
