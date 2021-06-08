class MvAdminCommentsToUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def up
    add_column :user_registration_projects, :admin_comments, :string
    UserRegistration.all.each do |ur|
      ur.user_registration_projects.update_all admin_comments: ur.admin_comments
    end
    remove_column :user_registrations, :admin_comments
  end

  def down
    add_column :user_registrations, :admin_comments, :string
    UserRegistration.all.each do |ur|
      ur.update_attributes admin_comments: ur.user_registration_projects.first.admin_comments
    end
    remove_column :user_registration_projects, :admin_comments
  end
end
