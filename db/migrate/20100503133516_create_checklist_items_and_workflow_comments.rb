class CreateChecklistItemsAndWorkflowComments < ActiveRecord::Migration

  def self.up
    create_table :checklist_items do |t|
      t.integer :interview_id, :null => false
      t.integer :user_id, :null => false
      t.string  :item_type, :null => false
      t.boolean :checked
      t.datetime  :checked_at
      t.datetime :updated_at
    end

    add_index :checklist_items, :interview_id
    add_index :checklist_items, [ :interview_id, :checked ]

    
    create_table :workflow_comments do |t|
      t.integer :interview_id, :null => false
      t.integer :user_id, :null => false
      t.integer :parent_id
      t.string  :workflow_type, :null => false
      t.boolean :public, :default => true
      t.text  :comment
      t.string  :user_initials, :limit => 4
      t.timestamps
    end

    add_index :workflow_comments, :interview_id
    add_index :workflow_comments, [ :interview_id, :public ]
    add_index :workflow_comments, [ :interview_id, :parent_id ]
  end

  def self.down
    drop_table :checklist_items
    drop_table :workflow_comments
  end

end
