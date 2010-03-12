class Segment < ActiveRecord::Base

  belongs_to :tape

  has_one :previous_segment,
          :class_name => 'Segment'

  has_one :following_segment,
          :class_name => 'Segment'

  delegate  :interview,
            :to => :tape

  Category::ARCHIVE_CATEGORIES.each do |category|
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      interview.#{category.first.to_s.singularize}_ids
    end
DEF
  end

  named_scope :headings, :conditions => ["CHAR_LENGTH(mainheading) > 0 OR CHAR_LENGTH(subheading) > 0"]
  
  validates_presence_of :timecode, :media_id
  validates_presence_of :translation, :if => Proc.new{|i| i.transcript.blank? }
  validates_presence_of :transcript, :if => Proc.new{|i| i.translation.blank? }
  validates_uniqueness_of :media_id
  validates_format_of :media_id, :with => /^[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}$/i

  validates_associated :tape


  searchable :auto_index => false do
    string :archive_id, :stored => true
    string :media_id, :stored => true
    string :timecode
    text :joined_transcript_and_translation
    text :mainheading, :boost => 10
    text :subheading, :boost => 10
    #text :transcript
    #text :translation, :boost => 2
    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true, :stored => true, :references => Category )
    end
    string :person_name, :using => :full_title, :stored => false
  end

  # use the MediaId Adapters
  #Sunspot::Adapters::InstanceAdapter.register(ZWAR::Sunspot::Adapters::MediaIdInstanceAdapter, self)
  #Sunspot::Adapters::DataAccessor.register(ZWAR::Sunspot::Adapters::MediaIdDataAccessor, self)

  def interview_id
    interview.id
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

  def timecode
    "[#{tape.number}] #{read_attribute(:timecode).sub(/\.\d\d$/,'')}"
  end

  def raw_timecode
    read_attribute :timecode
  end

  def start_time
    @time ||= Timecode.new(raw_timecode).time
  end

  def end_time
    @time + duration 
  end

  def language_id
    interview.language_id
  end

  def full_title
    interview.full_title
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

  private

  # remove workflow comments
  def filter_annotation(text)
    text.gsub(/\{[^{}]+\}/,'')
  end

end