class ActivateUsersMissedByFormerMigrations < ActiveRecord::Migration[5.2]
  def up
   UserRegistration.where(workflow_state: 'project_access_granted').each do |registration|
     activated_at = registration.activated_at || (registration.user_account && registration.user_account.created_at)
     registration.user_registration_projects.first.update_attribute(:activated_at, activated_at)
     registration.update_attribute(:activated_at, activated_at)
   end
  end
  def down
  end
end
