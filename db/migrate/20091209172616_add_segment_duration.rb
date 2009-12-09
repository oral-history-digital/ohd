class AddSegmentDuration < ActiveRecord::Migration

  def self.up

    remove_column :segments, :duration

    change_table :segments do |t|
      t.decimal :duration, :scale => 2, :precision => 5
    end

    Rake::Task['data:segment_duration'].execute

  end

  def self.down

    remove_column :segments, :duration

    change_table :segments do |t|
      t.integer :duration
    end
    
  end

end
