class ChangeTasksColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :interview_id, :integer
    remove_column :tasks, :authorized_type, :string
    remove_column :tasks, :authorized_id, :integer
  end
end
