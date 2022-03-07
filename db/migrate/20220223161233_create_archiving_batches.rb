class CreateArchivingBatches < ActiveRecord::Migration[5.2]
  def change
    create_table :archiving_batches do |t|
      t.integer :number, null: false
      t.belongs_to :project, null: false, index: true, foreign_key: true
    end

    create_join_table :interviews, :archiving_batches do |t|
      t.index :archiving_batch_id
    end
  end
end
