class CaptionsSegment < ActiveRecord::Base

  belongs_to :segment

  belongs_to :tape

  belongs_to :interview

  named_scope :with_heading,
              :joins => :translations,
              :conditions => [
                  "captions_segment_translations.locale = ?
                  AND (
                    (captions_segment_translations.mainheading IS NOT NULL AND captions_segment_translations.mainheading <> '')
                    OR
                    (captions_segment_translations.subheading IS NOT NULL AND captions_segment_translations.subheading <> '')
                  )",
                  I18n.default_locale.to_s
              ],
              :include => :translations

  named_scope :for_media_id, lambda {|mid| { :conditions => ["media_id < ?", mid.sub(/\d{4}$/,(mid[/\d{4}$/].to_i+1).to_s.rjust(4,'0'))], :order => "media_id DESC", :limit => 1 }}

  translates :mainheading, :subheading

  validates_presence_of :sequence_number, :transcript, :timecode
  validates_presence_of :segment_id, :if => Proc.new{|c| c.media_id.blank? }
  validates_uniqueness_of :sequence_number, :scope => :tape_id

  def time_begin
    time.to_i
  end

  def time_end
    (time + duration).to_i
  end

  def transcript
    read_attribute(:transcript) || ''
  end

  def translation
    read_attribute(:translation) || ''
  end

  # Ignore translation in German interviews
  def translation=(text)
    text = '(...)' if text =~ /^(\(\.\.\.\)\s?)+$/
    text = '' if !tape.language.nil? && tape.language.name == 'Deutsch'
    write_attribute :translation, text
  end

  def characters_per_second
    transcript.length / (duration || 1)
  end

  def tape_number
    tape.number
  end

  def time
    @time ||= Timecode.new(timecode).time
  end

  def time=(new_time)
    @time = new_time
    write_attribute :timecode, Timecode.new(@time).timecode
  end

  def timecode=(new_timecode)
    raise "Wrong timecode type '#{new_timecode.class.name}', expected 'String'." \
      unless new_timecode.is_a?(String)
    @time = Timecode.new(new_timecode).time
    write_attribute :timecode, new_timecode
  end

  def to_hash_for_export(options={})
    exclude = [ :segment_id,
                :tape_id,
                :created_at,
                :updated_at ]
    super(options.merge!({ :exclude => exclude }))
  end

end
