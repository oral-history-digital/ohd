class AddSegmentIdToAnnotations < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    change_table :annotations do |t|
      t.integer :segment_id
    end
    add_index :annotations, :segment_id
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :annotations, :segment_id
  end
  end
end
