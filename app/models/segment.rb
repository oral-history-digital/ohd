class Segment < ActiveRecord::Base

  belongs_to :interview

  belongs_to :tape

  has_one   :previous_segment,
            :class_name => 'Segment'

  has_one   :following_segment,
            :class_name => 'Segment'

  has_many  :location_segments

  has_many  :location_references,
            :through => :location_segments

  Category::ARCHIVE_CATEGORIES.each do |category|
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      interview.#{category.first.to_s.singularize}_ids
    end
DEF
  end

  named_scope :headings, :conditions => ["CHAR_LENGTH(mainheading) > 0 OR CHAR_LENGTH(subheading) > 0"]
  named_scope :for_interview, lambda {|i| {:conditions => ['segments.interview_id = ?', i.id]} }

  named_scope :for_media_id, lambda {|mid| { :conditions => ["media_id < ?", mid.sub(/\d{4}$/,(mid[/\d{4}$/].to_i+1).to_s.rjust(4,'0'))], :order => "media_id DESC", :limit => 1 }}
  
  validates_presence_of :timecode, :media_id
  validates_presence_of :translation, :if => Proc.new{|i| i.transcript.blank? }
  validates_presence_of :transcript, :if => Proc.new{|i| i.translation.blank? }

  # NOTE: NO UNIQUENESS OF MEDIA_ID!
  # due to segment splitting as captions, the media id can be repeated!!
  # validates_uniqueness_of :media_id
  validates_format_of :media_id, :with => /^[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}$/i

  validates_associated :tape

  def before_validation_on_create
    # make sure we have a tape assigned
    if self.tape.nil?
      tape_media_id = (media_id || '')[/za\d{3}_\d{2}_\d{2}/i]
      interview_archive_id = (media_id || '')[/za\d{3}/i]
      interview ||= Interview.find_by_archive_id(interview_archive_id)
      raise "No interview found for archive_id='#{interview_archive_id}'" if interview.nil?
      interview_id = interview.id
      tape = Tape.find_or_initialize_by_media_id_and_interview_id(tape_media_id, interview_id)
      raise "No tape found for media_id='#{tape_media_id}' and interview_id=#{interview_id}" if tape.nil?
      tape.save
      tape.segments << self
    end
  end


  searchable :auto_index => false do
    string :archive_id, :stored => true
    string :media_id, :stored => true
    string :timecode
    text :joined_transcript_and_translation
    text :mainheading, :boost => 10
    text :subheading, :boost => 10
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
    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true, :stored => true, :references => Category )
    end
    string :person_name, :stored => false do
      (full_title + ' ' + alias_names).squeeze(' ')
    end
  end

  # use the MediaId Adapters
  #Sunspot::Adapters::InstanceAdapter.register(ZWAR::Sunspot::Adapters::MediaIdInstanceAdapter, self)
  #Sunspot::Adapters::DataAccessor.register(ZWAR::Sunspot::Adapters::MediaIdDataAccessor, self)

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

  def full_title
    interview.full_title || ''
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

  # returns the segment that leads the chapter
  def section_lead_segment
    Segment.find :first,
                 :conditions => ["interview_id = ? AND section = ?", interview_id, section],
                 :order => "media_id ASC"
  end

  private

  # remove workflow comments
  def filter_annotation(text)
    text.gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
  end

end