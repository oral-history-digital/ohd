class MoveReceiveNewsletterToUserProject < ActiveRecord::Migration[7.0]
  def change
    add_column :user_projects, :tos_agreement, :boolean, default: false
    add_column :user_projects, :receive_newsletter, :boolean, default: false
    UserProject.where(user_id: User.where(receive_newsletter: true).map(&:id)).update_all receive_newsletter: true
    remove_column :users, :receive_newsletter, :boolean, default: false
    remove_column :user_projects, :user_registration_id, :integer # cleanup
  end
end
