class AddWorkflowStateToCollections < ActiveRecord::Migration[8.0]
  def up
    add_column :collections, :workflow_state, :string, null: false, default: 'public'
    Collection.reset_column_information
    Collection.find_each do |collection|
      unless collection.interviews.exists?(workflow_state: 'public')
        collection.update_column(:workflow_state, 'unshared')
      end
    end
  end
  def down
    remove_column :collections, :workflow_state
  end
end
