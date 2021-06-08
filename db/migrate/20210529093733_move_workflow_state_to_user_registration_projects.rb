class MoveWorkflowStateToUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def up
    add_column :user_registration_projects, :workflow_state, :string
    UserRegistration.all.each do |ur| 
      ur.user_registration_projects.update_all workflow_state: ur.workflow_state
    end
    remove_column :user_registrations, :workflow_state
  end

  def down
    add_column :user_registration, :workflow_state, :string
    UserRegistration.all.each do |ur| 
      ur.update_attributes workflow_state: ur.user_registration_projects.first.workflow_state
    end
    remove_column :user_registration_projects, :workflow_state
  end
end
