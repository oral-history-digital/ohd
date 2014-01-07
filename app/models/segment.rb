require 'globalize'

class Segment < ActiveRecord::Base

  belongs_to :interview,
             :include => :translations

  belongs_to :tape

  has_many  :location_segments

  has_many  :location_references,
            :through => :location_segments

  # NB: Don't use a :dependent => :destroy or :delete
  # on these, as they are user-generated.
  has_many  :annotations

  Category::ARCHIVE_CATEGORIES.each do |category|
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      interview.#{category.first.to_s.singularize}_ids
    end
DEF
  end

  named_scope :with_heading,
              :joins => :translations,
              :conditions => [
                  "segment_translations.locale = ?
                  AND (
                    (segment_translations.mainheading IS NOT NULL AND segment_translations.mainheading <> '')
                    OR
                    (segment_translations.subheading IS NOT NULL AND segment_translations.subheading <> '')
                  )",
                  I18n.default_locale.to_s
              ],
              :include => [:tape, :translations]

  named_scope :for_interview, lambda {|i| {:conditions => ['segments.interview_id = ?', i.id]} }

  named_scope :for_media_id,
              lambda {|mid|
                {
                    :conditions => [
                        "segments.media_id < ?",
                        Segment.media_id_successor(mid)
                    ],
                    :order => "media_id DESC",
                    :limit => 1
                }
              }

  translates :mainheading, :subheading

  validates_presence_of :timecode, :media_id
  validates_presence_of :translation, :if => Proc.new{|i| i.transcript.blank? }
  validates_presence_of :transcript, :if => Proc.new{|i| i.translation.blank? }

  # NOTE: NO UNIQUENESS OF MEDIA_ID!
  # due to segment splitting as captions, the media id can be repeated!!
  # validates_uniqueness_of :media_id
  validates_format_of :media_id, :with => /^[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}$/i

  validates_associated :interview
  validates_associated :tape

  after_create :reassign_user_content

  def before_validation_on_create
    # Make sure we have a tape assigned.
    if self.tape.nil?
      raise "Interview ID missing." if self.interview_id.nil?

      tape_media_id = (self.media_id || '')[/za\d{3}_\d{2}_\d{2}/i]
      tape = Tape.first(:conditions => {:media_id => tape_media_id, :interview_id => self.interview_id})
      raise "No tape found for media_id='#{tape_media_id}' and interview_id=#{self.interview_id}" if tape.nil?

      self.tape_id = tape.id
    end
  end

  searchable :auto_index => false do
    string :archive_id, :stored => true
    string :media_id, :stored => true
    string :timecode
    text :joined_transcript_and_translation
    text :mainheading, :boost => 10 do
      mainheading = ''
      translations.each do |translation|
        mainheading << ' ' + translation.mainheading unless translation.mainheading.blank?
      end
      mainheading.strip
    end
    text :subheading, :boost => 10 do
      subheading = ''
      translations.each do |translation|
        subheading << ' ' + translation.subheading unless translation.subheading.blank?
      end
      subheading.strip
    end
    text :locations, :boost => 5 do
      str = ''
      location_references.each do |location|
        str << ' ' + location.name
        (location.alias_location_names || '').split(/;\s+/).each do |name|
          str << ' ' + name
        end
        str.squeeze(' ')
      end
      str
    end
  end

  def archive_id
    @archive_id || interview.archive_id
  end

  def archive_id=(code)
    @archive_id = code
  end

  def media_id=(id)
    write_attribute :media_id, id.upcase
  end

  def media_id
    (read_attribute(:media_id) || '').upcase
  end

  # return a range of media ids up to and not including the segment's media id
  def media_ids_up_to(segment)
    segment = nil if (segment.tape != self.tape) || (segment.media_id < self.media_id)
    media_index = self.media_id[/\d{4}$/].to_i
    base_media_id = self.media_id.sub(/\d{4}$/,'')
    range_size = 2
    unless segment.nil?
      range_size = segment.media_id[/\d{4}$/].to_i - media_index - 1
    end
    ids = [media_id]
    if range_size > 0
      ids << base_media_id + (media_index + range_size).to_s.rjust(4,'0')
    end
    ids
  end

  def timecode
    timestr = read_attribute(:timecode).sub(/\.\d\d$/,'')
    unless tape.blank?
      "[#{tape.number}] #{timestr}"
    else
      timestr
    end
  end

  def raw_timecode
    read_attribute :timecode
  end

  def start_time
    @time ||= Timecode.new(raw_timecode).time
  end

  def end_time
    start_time + duration
  end

  def language_id
    interview.language_id
  end

  def alias_names
    interview.alias_names || ''
  end

  def transcript
    filter_annotation read_attribute(:transcript)
  end

  def translation
    filter_annotation read_attribute(:translation)
  end

  def joined_transcript_and_translation
    ((transcript || '') + ' ' + (translation || '')).strip
  end

  # not a true association, this is primarily used during Solr indexing
  def annotations
    Annotation.for_segment(self)
  end

  # returns the segment that leads the chapter
  def section_lead_segment
    Segment.first :conditions => ["interview_id = ? AND section = ?", interview_id, section],
                  :order => "media_id ASC"
  end

  def self.media_id_successor(mid)
    Segment.media_id_diff(mid, 1)
  end

  def self.media_id_predecessor(mid)
    Segment.media_id_diff(mid, -1)
  end

  def self.media_id_diff(mid, diff)
    mid.sub(/\d{4}$/,(mid[/\d{4}$/].to_i + diff.to_i).to_s.rjust(4,'0'))
  end

  private

  # remove workflow comments
  def filter_annotation(text)
    text.gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
  end

  # This is used to reassociate all segment-based user_content,
  # i.e. user_annotations and their annotations.
  def reassign_user_content
    # As we don't know the subsequent segments media_id yet,
    # theoretically all the trailing annotations would have to
    # be assigned to each segment, so that annotations on the last
    # segment get assigned to each of the interviews segments in turn.
    # To avoid this, I'm using an arbitrary media_id range of media_id..media_id+12
    # which in practice should be safe for reassigning to the correct segment, while
    # minimizing subsequent reassignments.
    UserAnnotation.find_each(
        :conditions =>
            ["media_id >= ? AND media_id < ?", media_id, Segment.media_id_diff(media_id, 12)],
        :include => :annotation
    ) do |user_annotation|
      user_annotation.update_attribute :reference_id, self.id
      unless user_annotation.annotation.nil?
        user_annotation.annotation.update_attribute :segment_id, self.id
      end
    end
  end

end
