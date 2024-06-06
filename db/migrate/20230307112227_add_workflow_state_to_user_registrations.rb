class AddWorkflowStateToUserRegistrations < ActiveRecord::Migration[7.0]
  def up
    add_column :user_registrations, :workflow_state, :string
  end
  def down
    remove_column :user_registrations, :workflow_state
  end
end
