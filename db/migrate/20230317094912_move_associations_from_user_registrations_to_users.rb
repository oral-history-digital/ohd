class MoveAssociationsFromUserRegistrationsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :user_registration_projects, :user_id, :integer
    add_column :sessions, :user_id, :integer

    rename_table :user_registration_projects, :user_projects

    execute "UPDATE user_projects INNER JOIN user_registrations ON user_registrations.id = user_projects.user_registration_id SET user_projects.user_id = user_registrations.user_account_id"

    execute "UPDATE users INNER JOIN user_registrations ON user_registrations.user_account_id = users.id SET users.confirmed_at = user_registrations.activated_at WHERE user_registrations.activated_at IS NOT NULL AND users.confirmed_at IS NULL"

    UserRole.update_all("user_id = user_account_id")
    Task.update_all("user_id = user_account_id")
    UserContent.update_all("user_id = user_account_id")
    WorkflowComment.update_all("user_id = user_account_id")

    drop_table :user_registrations
    drop_table :checklist_items
    drop_table :user_account_ips

    rename_column :usage_reports, :user_account_id, :user_id

    remove_column :user_projects, :user_account_id
    remove_column :sessions, :user_account_id
    remove_column :user_roles, :user_account_id
    remove_column :tasks, :user_account_id
    rename_column :tasks, :assigned_to_user_account_at , :assigned_to_user_at 
    remove_column :user_contents, :user_account_id
    remove_column :workflow_comments, :user_account_id
  end
end
