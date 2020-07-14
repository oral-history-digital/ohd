class ActivateProjectForRegisteredUsers < ActiveRecord::Migration[5.2]
  def up
     UserRegistration.where(workflow_state: 'registered').update_all(workflow_state: 'account_confirmed')
     UserRegistration.where(workflow_state: 'account_confirmed').each do |registration|
       registration.user_registration_projects.first.update_attribute(:activated_at, registration.activated_at)
       UserRegistration.where(id: registration.id).update_all(workflow_state: 'project_access_granted')
     end
  end
  def down
  end
end
