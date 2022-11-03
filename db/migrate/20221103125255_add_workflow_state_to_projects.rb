class AddWorkflowStateToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :workflow_state, :string,
      null: false, default: 'public'
    add_index :projects, :workflow_state
  end
end
