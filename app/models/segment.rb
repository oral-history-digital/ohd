require 'globalize'

class Segment < ActiveRecord::Base
  include IsoHelpers

  belongs_to :interview#, inverse_of: :segments
  belongs_to :speaking_person, 
    -> { includes(:translations) },
    class_name: 'Person',
    foreign_key: 'speaker_id'

  belongs_to :tape#, inverse_of: :segments

  has_many  :registry_references,
            -> { includes(registry_entry: {registry_names: :translations}, registry_reference_type: {}) },
            :as => :ref_object,
            :dependent => :destroy

  has_many  :registry_entries,
            through: :registry_references

  # NB: Don't use a :dependent => :destroy or :delete
  # on these, as they are user-generated.
  has_many  :user_annotations, as: :reference
  has_many  :annotations

  scope :with_heading, -> { 
    joins(:translations).
    where("((segment_translations.mainheading IS NOT NULL AND segment_translations.mainheading <> '') OR (segment_translations.subheading IS NOT NULL AND segment_translations.subheading <> ''))").
    includes(:tape, :translations).
    order(:id)}

  scope :mainheadings_until, ->(segment_id, interview_id) { 
    joins(:translations).
    where("(segment_translations.mainheading IS NOT NULL AND segment_translations.mainheading <> '')").
    #where("(segment_translations.subheading IS NULL OR segment_translations.subheading = '')").
    where("segments.id <= ?", segment_id).
    where(interview_id: interview_id).
    includes(:tape, :translations).
    order(:id)}

  scope :subheadings_until, ->(segment_id, interview_id, mainheading_id) { 
    joins(:translations).
    where("(segment_translations.subheading IS NOT NULL AND segment_translations.subheading <> '')").
    where("segments.id <= ?", segment_id).
    where("segments.id >= ?", mainheading_id).
    where(interview_id: interview_id).
    includes(:tape, :translations).
    order(:id)}

  scope :for_interview_id, ->(interview_id){ includes(:interview, :tape).where('segments.interview_id = ?', interview_id) }

  scope :for_media_id, ->(mid) {
    where("segments.media_id < ?", Segment.media_id_successor(mid))
    .order(media_id: :desc)
     .limit(1)
  }


  # ZWAR_MIGRATE: uncomment this in between migrations (after  20170710104214_make_segment_speaker_associated)
  translates :mainheading, :subheading, :text

  validates_presence_of :timecode#, :media_id

  # TODO: rm this: segments won`t change id any more when platform and archive are joined together?!
  # NOTE: NO UNIQUENESS OF MEDIA_ID!
  # due to segment splitting as captions, the media id can be repeated!!
  # validates_uniqueness_of :media_id
  #validates_format_of :media_id, :with => /\A[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}\z/i

  validates_associated :interview
  validates_associated :tape

  # TODO: rm this: segments won`t change id any more when platform and archive are joined together?!
  #after_create :reassign_user_content

  before_validation :do_before_validation_on_create, :on => :create

  def identifier
    id
  end

  def identifier_method
    'id'
  end

  def do_before_validation_on_create
    # Make sure we have a tape assigned.
    if self.tape.nil?
      raise "Interview ID missing." if self.interview_id.nil?

      tape_media_id = (self.media_id || '')[Regexp.new("#{Project.project_initials}\\d{3}_\\d{2}_\\d{2}", Regexp::IGNORECASE)]
      tape = Tape.where({media_id: tape_media_id, interview_id: self.interview_id}).first
      raise "No tape found for media_id='#{tape_media_id}' and interview_id=#{self.interview_id}" if tape.nil?

      self.tape_id = tape.id
    end
  end

  searchable do
    string :archive_id, :stored => true
    string :media_id, :stored => true
    string :timecode

    (Project.available_locales + [:orig]).each do |locale|
      text :"text_#{locale}", stored: true
    end
    #dynamic_string :transcripts, stored: true  do # needs to be stored to enable highlighting
      #translations.inject({}) do |mem, translation| 
        #mem["text_#{ISO_639.find(translation.locale.to_s).alpha2}"] = translation.text
        #mem
      #end
    #end
    #
    #
    # the following won`t run because of undefined method `translations' for #<Sunspot::DSL::Fields:0x00000006b9f518>
    #translations.each do |translation| 
      #text :"#{translation.text}", stored: true # needs to be stored to enable highlighting
    #end

    #text :mainheading, :boost => 10 do
      #mainheading = ''
      #translations.each do |translation|
        #mainheading << ' ' + translation.mainheading unless translation.mainheading.blank?
      #end
      #mainheading.strip
    #end
    #text :subheading, :boost => 10 do
      #subheading = ''
      #translations.each do |translation|
        #subheading << ' ' + translation.subheading unless translation.subheading.blank?
      #end
      #subheading.strip
    #end
    #text :registry_entries, :boost => 5 do
      #registry_references.map do |reference|
        #reference.registry_entry.search_string
      #end.join(' ')
    #end
    ## Also index the reference by all parent entries (classification)
    ## of the registry entry and its respective alias names.
    #text :classification, :boost => 6 do
      #registry_references.map do |reference|
        #reference.registry_entry.ancestors.map do |ancestor|
          #ancestor.search_string
        #end.join(' ')
      #end.join(' ')
    #end
    
  end

  (Project.available_locales).each do |locale|
    define_method "text_#{locale}" do 
      text(ISO_639.find(locale).send(Project.alpha))
    end
  end

  def text_orig 
    locale = orig_lang
    text(ISO_639.find(locale).send(Project.alpha))
  end

  def orig_lang
    interview.language.first_code
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

  def initials(locale)
    inits = []
    if !text(locale).blank?
      raw_initials = text(locale)[/\*\w+:\*/]
      inits << raw_initials[/\w+/] if raw_initials
    end
    inits
  end

  def start_time
    @time ||= Time.parse(timecode).seconds_since_midnight
  end

  def next
    interview.segments.where("timecode > ?", read_attribute(:timecode)).first
  end

  def prev
    interview.segments.where("timecode < ?", read_attribute(:timecode)).last
  end

  def alias_names
    interview.alias_names || ''
  end

  def transcripts
    # TODO: rm Nokogiri parser after segment sanitation
    translations.inject({}) do |mem, translation|
      mem[ISO_639.find(translation.locale.to_s).alpha2] = translation.text ? Nokogiri::HTML.parse(translation.text).text.sub(/^:[\S ]/, "") : ''
      #mem[ISO_639.find(translation.locale.to_s).alpha2] = translation.text ? Nokogiri::HTML.parse(translation.text).text.sub(/^\S*:\S{1}/, "") : ''
      mem
    end
  end

  def as_vtt_subtitles(lang)
    # TODO: rm strip
    raw_segment_text = text(projectified(lang))
    segment_text = speaker_changed(raw_segment_text) ? raw_segment_text.sub(/:/,"").strip() :  raw_segment_text
    "#{Time.at(start_time).utc.strftime('%H:%M:%S.%3N')} --> #{Time.at(self.next.start_time).utc.strftime('%H:%M:%S.%3N')}\n#{segment_text}"
  end

  def speaker_changed(raw_segment_text = false)
    # TODO: rm this method after segment sanitation and replace it s occurences
    raw_segment_text && raw_segment_text[1] == ":"
  end

  # returns the segment that leads the chapter
  def section_lead_segment
    Segment.where(["interview_id = ? AND section = ?", interview_id, section]).order(:media_id).first
  end

  def last_heading
    mainheadings = Segment.mainheadings_until(id, interview_id)
    if mainheadings.count > 0
      mainheadings_count = mainheadings.map{|mh| mh.mainheading(projectified(Project.available_locales.first))}.uniq.count
      subheadings = Segment.subheadings_until(id, interview_id, mainheadings.last.id)
      
      if subheadings.count > 0
        I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = "#{mainheadings_count}.#{subheadings.count}. #{subheadings.last.subheading(projectified(locale))}"
          mem
        end
      else
        I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = "#{mainheadings_count}. #{mainheadings.last.mainheading(projectified(locale))}"
          mem
        end
      end
    else
      {}
    end
  end

  def has_heading?
    translation_with_heading = translations.detect do |t|
      not (t.mainheading.blank? and t.subheading.blank?)
    end
    not translation_with_heading.nil?
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
    #text.gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
    (text || '').gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
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
    UserAnnotation.where(["media_id >= ? AND media_id < ?", media_id, Segment.media_id_diff(media_id, 12)]).
      includes(:annotation).find_each do |user_annotation|
        user_annotation.update_attribute :reference_id, self.id
        unless user_annotation.annotation.nil?
          user_annotation.annotation.update_attribute :segment_id, self.id
        end
      end
  end

end
