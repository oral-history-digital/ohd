class Heading < ActiveRecord::Base

  belongs_to :segment
  belongs_to :tape

  # only one heading per type per segment
  validates_uniqueness_of :segment_id, :scope => [ :mainheading ]

  def to_s
    title
  end

end

class RefactorTapes < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    remove_column(:headings, :timecode)
    add_column(:headings, :segment_id, :int)

    Heading.all.each do |heading|
      segment = Segment.first(:conditions => { :media_id => heading.media_id.upcase })
      heading.update_attribute :segment_id, segment.id
      STDOUT::printf '.'
      STDOUT.flush
    end
    puts

  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column(:headings, :segment_id)
    add_column(:headings, :timecode, :string)
  end
  end
end
