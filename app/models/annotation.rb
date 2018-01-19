require 'globalize'

class Annotation < ActiveRecord::Base
  include IsoHelpers

  # this is only true for editorial annotations
  # user annotations are linked to the segment directly, to circumvent the
  # automatic deletion on an archive import.

  belongs_to :interview
  belongs_to :user_content

  # The segment association is fragile, because a re-import will recreate
  # the segments - while user generated annotations will not be re-created,
  # thus outdating their foreign keys.
  # For this reason, a segment#before_create callback is implemented
  # that reassociates the user_annotation and annotation content.
  belongs_to :segment

  scope :for_segment, -> (segment) {
                        where(["media_id > ?",
                                Segment.for_media_id(segment.media_id.sub(/\d{4}$/,(segment.media_id[/\d{4}$/].to_i-1).to_s.rjust(4,'0'))).first &&
                                Segment.for_media_id(segment.media_id.sub(/\d{4}$/,(segment.media_id[/\d{4}$/].to_i-1).to_s.rjust(4,'0'))).first.media_id
                        ]).
                        order("media_id ASC").
                        includes(:translations).
                        first
                      }
  scope :for_interview, -> (interview) {
                        where(["media_id LIKE ?",
                            interview.archive_id.upcase.concat('%')
                        ]).
                        order("user_content_id ASC").
                        includes(:translations)
                      }

  translates :text

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
    media_id[Regexp.new("^#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)].downcase
  end

  def assign_segment
    segment = Segment.for_media_id(media_id).first
    unless segment.nil?
      self.segment_id = segment.id
      self.timecode = segment.timecode
    end
  end

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(text(projectified(locale))).gsub("&nbsp;", " ")
      mem
    end
  end

end
