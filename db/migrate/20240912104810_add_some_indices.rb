class AddSomeIndices < ActiveRecord::Migration[7.0]
  def change
    add_index :segments, :tape_id
    add_index :segments, :speaker_id
    add_index :segments, :timecode
  end
end
