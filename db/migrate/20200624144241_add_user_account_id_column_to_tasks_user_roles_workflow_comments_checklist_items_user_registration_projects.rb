class AddUserAccountIdColumnToTasksUserRolesWorkflowCommentsChecklistItemsUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :user_registration_projects, :user_account_id, :integer
    add_column :tasks, :user_account_id, :integer
    add_column :workflow_comments, :user_account_id, :integer
    add_column :checklist_items, :user_account_id, :integer
    add_column :user_roles, :user_account_id, :integer
    add_column :user_contents, :user_account_id, :integer
  end
end
