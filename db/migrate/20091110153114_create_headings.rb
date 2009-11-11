class CreateHeadings < ActiveRecord::Migration
  def self.up
    create_table :headings do |t|
      t.references :tape
      t.string :media_id, :null => :false
      t.string :timecode, :null => :false
      t.boolean :mainheading, :null => :false
      t.string :title, :null => :false
      t.timestamps
    end
  end

  def self.down
    drop_table :headings
  end
end
