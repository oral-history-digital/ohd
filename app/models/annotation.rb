class Annotation < ActiveRecord::Base

  belongs_to :interview

  named_scope :for_segment, lambda{|segment| { :conditions => ["media_id > ?", Segment.for_media_id(segment.media_id.sub(/\d{4}$/,(segment.media_id[/\d{4}$/].to_i-1).to_s.rjust(4,'0'))).first.media_id], :order => "media_id ASC", :limit => 1 }}

  def start_time
    Timecode.new(timecode).time
  end

  def tape_number
    media_id[/_\d{2}_\d{2}/].sub(/^_\d{2}_/, '').to_i
  end

end