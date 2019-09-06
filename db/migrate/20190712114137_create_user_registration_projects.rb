class CreateUserRegistrationProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :user_registration_projects do |t|
      t.integer :project_id
      t.integer :user_registration_id

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        UserRegistration.all.each do |user_registration|
          UserRegistrationProject.create project_id: Project.current.id, user_registration_id: user_registration.id
        end
      end

      dir.down do
      end
    end
  end
end
