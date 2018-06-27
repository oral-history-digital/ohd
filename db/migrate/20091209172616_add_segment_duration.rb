class AddSegmentDuration < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog

    remove_column :segments, :duration

    change_table :segments do |t|
      t.decimal :duration, :scale => 2, :precision => 5
    end

    Rake::Task['data:segment_duration'].execute

  end
  end

  def self.down
  unless Project.name.to_sym == :mog

    remove_column :segments, :duration

    change_table :segments do |t|
      t.integer :duration
    end
    
  end
  end

end
