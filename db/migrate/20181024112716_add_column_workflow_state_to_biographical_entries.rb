class AddColumnWorkflowStateToBiographicalEntries < ActiveRecord::Migration[5.2]
  def change
    add_column :biographical_entries, :workflow_state, :string, default: 'unshared'
  end
end
