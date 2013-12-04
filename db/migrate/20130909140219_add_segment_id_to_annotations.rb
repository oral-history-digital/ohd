class AddSegmentIdToAnnotations < ActiveRecord::Migration
  def self.up
    change_table :annotations do |t|
      t.integer :segment_id
    end
    add_index :annotations, :segment_id
  end

  def self.down
    remove_column :annotations, :segment_id
  end
end
