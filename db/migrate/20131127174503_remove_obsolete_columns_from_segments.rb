class RemoveObsoleteColumnsFromSegments < ActiveRecord::Migration
  def self.up
    remove_column :segments, :previous_segment_id, :following_segment_id
  end

  def self.down
    add_column :segments, :previous_segment_id, :integer
    add_column :segments, :following_segment_id, :integer
  end
end
