class AddDatesToUserRegistrationProjects < ActiveRecord::Migration[7.0]
  def change
    add_column :user_registration_projects, :processed_at, :datetime
    add_column :user_registration_projects, :terminated_at, :datetime
  end
end
