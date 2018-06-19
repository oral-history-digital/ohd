class AddWorkflowToTapes < ActiveRecord::Migration

  def self.up

    change_table :tapes do |t|
      t.string :workflow_state, :default => 'digitized'
    end
    add_index :tapes, :workflow_state

    Tape.update_all("workflow_state = 'segmented'")

  end

  def self.down

    change_table :tapes do |t|
      t.remove :workflow_state
    end

  end

end
