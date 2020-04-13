class AddWorkflowStateToContributions < ActiveRecord::Migration[5.2]
  def change
    add_column :contributions, :workflow_state, :string, default: 'unshared'
    Contribution.update_all workflow_state: 'public'
    RegistryReference.update_all workflow_state: 'checked'
  end
end
