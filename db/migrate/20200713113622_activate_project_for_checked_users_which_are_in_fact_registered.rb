class ActivateProjectForCheckedUsersWhichAreInFactRegistered < ActiveRecord::Migration[5.2]
  def up
     UserRegistration.where(workflow_state: 'checked').each do |registration|
       account = registration.user_account
       if account.deactivated_at.nil? && !account.last_sign_in_at.nil?
         registration.user_registration_projects.first.update_attribute(:activated_at, registration.activated_at)
         UserRegistration.where(id: registration.id).update_all(workflow_state: 'project_access_granted', updated_at: DateTime.now)
       end
     end
  end
  def down
  end
end
