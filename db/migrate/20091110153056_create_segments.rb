class CreateSegments < ActiveRecord::Migration
  def self.up
    create_table :segments do |t|
      t.references :tape
      t.string :media_id, :null => :false
      t.string :timecode, :null => :false
      t.string :duration, :null => :false
      t.string :transcript, :null => :false, :limit => 2000
      t.string :translation, :null => :false, :limit => 2000
      t.timestamps
    end
  end

  def self.down
    drop_table :segments
  end
end
