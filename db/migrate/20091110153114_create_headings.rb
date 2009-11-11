class CreateHeadings < ActiveRecord::Migration
  def self.up
    create_table :headings do |t|
      t.references :tape
      t.string :media_id
      t.string :timecode
      t.boolean :mainheading
      t.string :title
      t.timestamps
    end
  end

  def self.down
    drop_table :headings
  end
end
