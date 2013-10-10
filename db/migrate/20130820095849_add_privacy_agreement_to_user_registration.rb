class AddPrivacyAgreementToUserRegistration < ActiveRecord::Migration
  def self.up
    add_column :user_registrations, :priv_agreement, :boolean, :default => false
  end

  def self.down
    remove_column :user_registrations, :priv_agreement
  end
end
