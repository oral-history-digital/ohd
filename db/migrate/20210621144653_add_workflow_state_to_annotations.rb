class AddWorkflowStateToAnnotations < ActiveRecord::Migration[5.2]
  def change
    add_column :annotations, :workflow_state, :string, default: 'public'
  end
end
