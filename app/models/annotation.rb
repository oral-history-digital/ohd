class Annotation < ActiveRecord::Base

  # this is only true for editorial annotations
  # user annotations are linked to the segment directly, to circumvent the
  # automatic deletion on an archive import.

  belongs_to :interview
  belongs_to :user_content

  # the segment association is fragile, because a re-import will recreate
  # the segments - while user generated annotations will not be re-created,
  # thus outdating their foreign keys.
  # For this reason, a segment#after_create callback is implemented
  # that reassociates the user_annotation and annotation content.
  belongs_to :segment

  named_scope :for_segment, lambda{|segment| { :conditions => ["media_id > ?", Segment.for_media_id(segment.media_id.sub(/\d{4}$/,(segment.media_id[/\d{4}$/].to_i-1).to_s.rjust(4,'0'))).first.media_id], :order => "media_id ASC", :limit => 1 }}

  # displayable user and editorial annotations per interview
  named_scope :displayable, lambda{|interview| { :conditions => ["media_id LIKE ?", interview.archive_id.upcase.concat('%')]}}

  # Validation: either interview_id or user_content_id must be nil
  validates_numericality_of :interview_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.user_content_id.nil?}
  validates_numericality_of :user_content_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.interview_id.nil?}

  before_create {|annotation| annotation.assign_segment}

  def start_time
    Timecode.new(timecode).time
  end

  def tape_number
    media_id[/_\d{2}_\d{2}/].sub(/^_\d{2}_/, '').to_i
  end

  def archive_id
    media_id[/^za\d{3}/i].downcase
  end

  def assign_segment
    if interview_id.blank?
      # interview_id set means editorially curated and imported
      # annotation, which don't have a segment association set
      segment = Segment.for_media_id(media_id).first
      unless segment.nil?
        self.segment_id = segment.id
        self.timecode = segment.timecode
      end
    end
  end

end