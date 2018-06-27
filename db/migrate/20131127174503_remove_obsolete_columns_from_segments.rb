class RemoveObsoleteColumnsFromSegments < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    remove_column :segments, :previous_segment_id, :following_segment_id
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    add_column :segments, :previous_segment_id, :integer
    add_column :segments, :following_segment_id, :integer
  end
  end
end
