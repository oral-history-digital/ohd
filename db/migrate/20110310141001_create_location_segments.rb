class CreateLocationSegments < ActiveRecord::Migration

  def self.up

    create_table :location_segments do |t|
      t.integer :location_reference_id
      t.integer :segment_id
      t.integer :interview_id
    end

    add_index :location_segments, :location_reference_id
    add_index :location_segments, [:location_reference_id, :interview_id], name: 'location_segments_reference_and_interview'

  end

  def self.down
    drop_table :locations_segments
  end

end
