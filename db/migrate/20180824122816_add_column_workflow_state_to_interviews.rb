class AddColumnWorkflowStateToInterviews < ActiveRecord::Migration[5.0]
  def change
    add_column :interviews, :workflow_state, :string, default: 'unshared'
  end
end
