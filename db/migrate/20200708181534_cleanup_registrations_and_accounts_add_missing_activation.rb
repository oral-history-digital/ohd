class CleanupRegistrationsAndAccountsAddMissingActivation < ActiveRecord::Migration[5.2]
  def up
     UserRegistration.where(workflow_state: 'registered').where(activated_at: nil).each do |registration|
       if registration.user_account && registration.user_account.deactivated_at.nil?
         registration.update_attribute :activated_at, registration.user_account.created_at
       end
     end
  end
  def down
  end
end
