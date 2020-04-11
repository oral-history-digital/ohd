class AddWorkflowStateToContributions < ActiveRecord::Migration[5.2]
  def change
    add_column :contributions, :workflow_state, :string, default: 'unshared'
  end
end
