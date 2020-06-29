class AddUserRegistrationDataToUserAccounts < ActiveRecord::Migration[5.2]
  def self.up
    UserRegistration.all.each do |registration|
      account = registration.user_account
      if account
        attrs = registration.attributes
        attrs.delete('id')
        attrs.delete('email') # user account already contains the email
        attrs.delete('application_info')
        # first_name and last_name might have been fetched
        attrs.delete('first_name') if registration.first_name == blank?
        attrs.delete('last_name') if registration.last_name == blank?
        account.update_attributes(attrs)
      end
    end
  end
  def self.down
  end
end
