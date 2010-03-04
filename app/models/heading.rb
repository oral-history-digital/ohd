class Heading < ActiveRecord::Base

  belongs_to :segment
  belongs_to :tape

  # only one heading per type per segment
  validates_uniqueness_of :segment_id, :scope => [ :mainheading ]

  def to_s
    title
  end

end