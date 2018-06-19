class Tape < ActiveRecord::Base
  include Workflow

  belongs_to :interview

  has_many  :segments,
            -> { order('media_id ASC, timecode ASC')},
           :dependent => :destroy

  #has_many :captions_segments,
            #-> { order('timecode ASC')},
           #:dependent => :destroy,
           #:include => :translations

  validates_presence_of :media_id, :interview_id
  validates_uniqueness_of :media_id

  before_validation :inform, on: :create
  before_save :check_state

  after_save :update_interview_duration

  # check that this tape matches the existing number
  # of tapes in it's media_id
  #
  # also validate that the media_id references the correct interview
  def validate_on_create
    unless media_id[/\w{2}\d+/].downcase == interview.archive_id.downcase
      errors.add(:media_id, 'Media-ID passt nicht nicht zum Interview.')
    end
    unless interview.tapes.blank?
      number_of_tapes = interview.tapes.first.media_id.split('_')[1]
      unless media_id.split('_')[1] == number_of_tapes
        errors.add(:media_id, 'Gesamtzahl der Bänder stimmt nicht überein mit anderen Bändern des Interviews.')
      end
    end
  end

  workflow do
    state :digitized do
      event :import, :transitions_to => :segmented
    end
    state :segmented
  end

  def to_s
    media_id.upcase
  end

  def number
    @number ||= media_id[/\d+$/]
  end

  def total_number_of_tapes
    media_id.sub(/^[A-Z_]+\d+_/, '')[/^\d+/].to_i
  end

  def media_file(extension, subdirectories=false)
    if subdirectories
      "#{interview.archive_id.upcase}/#{interview.archive_id.upcase}_archive/data/av/#{extension}/#{media_id.upcase}.#{extension}"
    else
      "#{media_id.upcase}.#{extension}"
    end
  end

  def estimated_duration
    return nil if segments.blank? || segments.empty?
    endtime = Timecode.new(segments.last.timecode)
    endtime.time += 3
    endtime.estimate!
    endtime
  end

  def correct_timecodes_for_duration(new_duration)
    factor = Timecode.new(new_duration).time / Timecode.new(duration).time
    puts "Time Correction for #{media_id} by a factor of #{factor}:"
    segments.each_with_index do |segment, index|
      timecode = Timecode.new segment.timecode
      timecode.time = timecode.time * factor
      if (index % 30 == 1)
        puts "Changing segment #{segment.media_id} timecode from #{segment.timecode} to #{timecode.timecode}"
      end
      segment.update_attribute(:timecode, timecode.timecode)
    end
    puts "done"
  end

  def update!
    update_attribute(:updated_at, Time.now)
  end

  def language
    @language ||= self.interview.language
  end

  def inform
    s = self
    puts "TAPE CREATED"
  end

  def number
    @number ||= (defined? tape_number) ? tape_number : media_id[/\d+$/].to_i
  end

  def media_id=(id)
    write_attribute :media_id, id.upcase
  end

  def media_id
    (read_attribute(:media_id) || '').upcase
  end

  def media_file(extension)
    "#{interview.archive_id.upcase}/#{interview.archive_id.upcase}_archive/data/av/#{extension}/#{media_id.upcase}.#{extension}"
  end

  def interviewee_initials
    @interviewee_initials ||= interview.person.firstname.first + interview.person.lastname.first
  end

  # Removes the checklist_item that signals completed checks on
  # transcription and speakers
  def reset_interview_speaker_checklist_item!
    self.interview.checklist_items.select{|i| i.item_type == 'speakers'}.each{|i| i.destroy }
  end

  def to_xml(options = {})
    options.merge!({ :include => :captions_segments, :methods => [] })
    super(options)
  end

  private

  def check_state
    import! unless segments.empty? or !digitized?
  end

  def update_interview_duration
    # update interview duration if this is the last tape
    if total_number_of_tapes == number.to_i
      interview.recalculate_duration!
    end
  end

end
