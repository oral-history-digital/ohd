class AddUserDataToUserAccounts < ActiveRecord::Migration[5.2]

  def self.up
    User.all.each do |user|
      account = user.user_account
      if account
        attrs = user.attributes
        attrs.delete('id')
        account.update_attributes(attrs)
      end
    end
  end
  def self.down
  end
end
