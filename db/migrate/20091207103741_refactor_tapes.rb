class RefactorTapes < ActiveRecord::Migration
  def self.up
    remove_column(:headings, :timecode)
    add_column(:headings, :segment_id, :int)

    Heading.find(:all).each do |heading|
      segment = Segment.find(:first, :conditions => {:media_id => heading.media_id})
      heading.update_attribute :segment_id, segment.id
      STDOUT::printf '.'
      STDOUT.flush
    end
  end

  def self.down
    remove_column(:headings, :segment_id)
    add_column(:headings, :timecode, :string)
  end
end