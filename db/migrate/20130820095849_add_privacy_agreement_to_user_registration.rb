class AddPrivacyAgreementToUserRegistration < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    #add_column :user_registrations, :priv_agreement, :boolean, :default => false
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :user_registrations, :priv_agreement
  end
  end
end
