class IncludeHeadingsInSegments < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    change_table :segments do |t|
      t.string :mainheading, :limit => 100
      t.string :subheading, :limit => 100
    end

    drop_table :headings

  end
  end

  def self.down
  unless Project.name.to_sym == :eog

    create_table :headings do |t|
      t.references :tape
      t.string :media_id, :null => :false
      t.string :timecode, :null => :false
      t.boolean :mainheading, :null => :false
      t.string :title, :null => :false
      t.timestamps
    end

    change_table :segments do |t|
      t.remove :mainheading
      t.remove :subheading
    end
    
  end
  end

end
