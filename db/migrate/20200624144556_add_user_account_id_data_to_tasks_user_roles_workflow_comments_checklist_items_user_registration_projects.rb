class AddUserAccountIdDataToTasksUserRolesWorkflowCommentsChecklistItemsUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def self.up
    UserRegistrationProject.all.each do |rp|
      registration = UserRegistration.find_by_id(rp.user_registration_id)
      if registration # TODO: we need to cleanup UserRegistrationProjects
        rp.update_attributes user_account_id: registration.user_account_id
      end
    end
    Task.all.each do |item|
      item.update_attributes user_account_id: item.user.user_account_id
    end
    UserRole.all.each do |item|
      item.update_attributes user_account_id: item.user.user_account_id
    end
    WorkflowComment.all.each do |item|
      item.update_attributes user_account_id: item.user.user_account_id
    end
    ChecklistItem.all.each do |item|
      item.update_attributes user_account_id: item.user.user_account_id
    end
    UserContent.all.each do |item|
      # attention: validation fails on our staging dump because translations of
      # annotations are missing
      item.update_attribute 'user_account_id', item.user.user_account_id
    end
  end
end
