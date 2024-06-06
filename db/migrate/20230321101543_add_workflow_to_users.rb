class AddWorkflowToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :workflow_state, :string, default: 'created'
    User.where.not(confirmed_at: nil).update_all(workflow_state: 'confirmed')
    remove_column :users, :activated_at
    remove_column :users, :deactivated_at
  end
end
