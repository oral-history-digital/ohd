class CreateUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :user_registration_projects do |t|
      t.integer :project_id
      t.integer :user_registration_id

      t.timestamps
    end
  end
end
