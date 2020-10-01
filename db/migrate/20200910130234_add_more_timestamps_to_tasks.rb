class AddMoreTimestampsToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :assigned_to_user_account_at, :datetime
    add_column :tasks, :assigned_to_supervisor_at, :datetime
    add_column :tasks, :started_at, :datetime
    add_column :tasks, :finished_at, :datetime
#    add_column :tasks, :cleared_at, :datetime # moved to 20200804091822_create_tasks_for_existing_interviews.rb
    add_column :tasks, :restarted_at, :datetime
  end
end
