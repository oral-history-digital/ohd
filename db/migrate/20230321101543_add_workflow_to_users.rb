class AddWorkflowToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :workflow_state, :string, default: 'created'
  end
end
