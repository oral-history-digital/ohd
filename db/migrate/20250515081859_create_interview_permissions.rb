class CreateInterviewPermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :interview_permissions do |t|
      t.integer :interview_id, foreign_key: true
      t.integer :user_id, foreign_key: true
      t.string :action_name

      t.timestamps
    end
  end
end
