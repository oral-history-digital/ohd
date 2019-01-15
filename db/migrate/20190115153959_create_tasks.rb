class CreateTasks < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks do |t|
      t.string :authorized_type
      t.integer :authorized_id
      t.text :desc
      t.string :workflow_state
      t.references :user
      t.references :supervisor

      t.timestamps
    end
  end
end
