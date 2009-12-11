class SequenceRefactoringForSegments < ActiveRecord::Migration

  def self.up

    change_table :segments do |t|
      t.integer :sequence_number
      t.integer :tape_number
      t.string  :speaker
      t.boolean :speaker_change, :default => false
      t.boolean :chapter_change, :default => false
      t.integer :previous_segment_id
      t.integer :following_segment_id
    end
    
  end

  def self.down

    change_table :segments do |t|
      t.remove :sequence_number
      t.remove :tape_number
      t.remove :speaker
      t.remove :speaker_change
      t.remove :chapter_change
      t.remove :previous_segment_id
      t.remove :following_segment_id
    end

  end

end
