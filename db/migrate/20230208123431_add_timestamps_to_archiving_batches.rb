class AddTimestampsToArchivingBatches < ActiveRecord::Migration[5.2]
  def change
    add_column :archiving_batches, :created_at, :timestamp
    add_column :archiving_batches, :updated_at, :timestamp
  end
end
