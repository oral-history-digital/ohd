class AddActivatedAtToUserRegistrationProject < ActiveRecord::Migration[5.2]
  def change
    add_column :user_registration_projects, :activated_at, :datetime
  end
end
