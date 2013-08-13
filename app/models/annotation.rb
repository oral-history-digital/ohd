class Annotation < ActiveRecord::Base

  # this is only true for editorial annotations
  # user annotations are linked to the segment directly, to circumvent the
  # automatic deletion on an archive import.

  belongs_to :interview
  belongs_to :user_content

  named_scope :for_segment, lambda{|segment| { :conditions => ["media_id > ?", Segment.for_media_id(segment.media_id.sub(/\d{4}$/,(segment.media_id[/\d{4}$/].to_i-1).to_s.rjust(4,'0'))).first.media_id], :order => "media_id ASC", :limit => 1 }}

  # displayable user and editorial annotations per interview
  named_scope :displayable, lambda{|interview| { :conditions => ["media_id LIKE ?", interview.archive_id.upcase.concat('%')]}}

  def start_time
    Timecode.new(timecode).time
  end

  def tape_number
    media_id[/_\d{2}_\d{2}/].sub(/^_\d{2}_/, '').to_i
  end

end