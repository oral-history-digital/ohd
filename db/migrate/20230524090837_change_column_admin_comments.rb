class ChangeColumnAdminComments < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :admin_comments, :mail_text
    rename_column :user_projects, :admin_comments, :mail_text
    change_column :user_projects, :mail_text, :text
  end
end
