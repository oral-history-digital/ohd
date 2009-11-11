class CreateSegments < ActiveRecord::Migration
  def self.up
    create_table :segments do |t|
      t.references :tape
      t.string :media_id
      t.string :timecode
      t.string :duration
      t.string :transcript, :limit => 2000
      t.string :translation, :limit => 2000
      t.timestamps
    end
  end

  def self.down
    drop_table :segments
  end
end
