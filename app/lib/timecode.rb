class Timecode
  # encapsulates Timecode-Formats and operations

  # Regular expression for matching a timecode in the format HH:MM:SS,
  # where HH can be 2 or more digits, and MM and SS are 2 digits each.
  CLOCK_PATTERN = /(?:[0-9]{2}|[1-9][0-9]{2,}):[0-5][0-9]:[0-5][0-9]/
  private_constant :CLOCK_PATTERN

  IMPORT_FRAME_RATES = [24, 25, 30, 50, 60].freeze

  # Indicates that an uploaded timestamp does not match the selected format.
  class ImportFormatError < ArgumentError; end

  # Checks whether a value is in the canonical segment storage format.
  # Accepts timecodes in the format HH:MM:SS.mmm, where HH can be 2 or more
  # digits, MM and SS are 2 digits each, and mmm is 3 digits.
  #
  # @param value [Object] Candidate timecode
  # @return [Boolean] Whether the value can be stored as-is
  def self.canonical?(value)
    value.is_a?(String) && /\A#{CLOCK_PATTERN}\.[0-9]{3}\z/.match?(value)
  end

  # Converts an uploaded timecode using the convention selected for the file.
  #
  # @param value [Object] Timecode from the upload
  # @param frame_rate [Integer, nil] Source frame rate for HH:MM:SS:FF, or nil for HH:MM:SS.mmm
  # @return [String] Canonical timecode
  # @raise [ImportFormatError] If the timecode or frame rate does not match a supported convention
  def self.parse_import(value, frame_rate: nil)
    validate_import_clock(value)

    if frame_rate.nil?
      return value if canonical?(value)

      raise ImportFormatError,
            'Use colons (:) between hours, minutes, and seconds, then a dot (.) followed by three millisecond digits, as in 00:04:29.000.'
    end

    unless frame_rate.is_a?(Integer) && IMPORT_FRAME_RATES.include?(frame_rate)
      raise ImportFormatError, "Choose a supported source frame rate (#{IMPORT_FRAME_RATES.join(', ')} fps)."
    end

    unless value.is_a?(String) && /\A#{CLOCK_PATTERN}:[0-9]{2}\z/.match?(value)
      raise ImportFormatError,
            'Use colons (:) between hours, minutes, seconds, and the two-digit frame number, as in 00:04:29:12.'
    end

    hours, minutes, seconds, frames = value.split(':').map(&:to_i)
    if frames >= frame_rate
      raise ImportFormatError, "At #{frame_rate} fps, the frame number must be between 00 and #{frame_rate - 1}."
    end

    format_duration(hours * 3600 + minutes * 60 + seconds + Rational(frames, frame_rate))
  end

  # Reports minutes or seconds outside 00–59 when those fields can be read.
  #
  # @param value [Object] Timecode from the upload
  # @return [void]
  # @raise [ImportFormatError] If a two-digit minute or second exceeds 59
  private_class_method def self.validate_import_clock(value)
    return unless value.is_a?(String)

    clock = /\A[0-9]+:([0-9]{2}):([0-9]{2})(?=[.:,;]|\z)/.match(value)
    return unless clock

    raise ImportFormatError, 'Minutes must be between 00 and 59.' if clock[1].to_i > 59
    raise ImportFormatError, 'Seconds must be between 00 and 59.' if clock[2].to_i > 59
  end

  def initialize(time=nil)
    @time = case time
      when String
        @timecode = time
        Timecode::parse_timecode(time)
      when Integer, Float, BigDecimal then time
      when NilClass then 0
      else nil
      end
  end

  def timecode=(time)
    @timecode = time
    @time = Timecode::parse_timecode(time)
  end

  def timecode
    @timecode ||= Timecode::format_duration(@time)
  end

  # pure time info without tape numeral
  def tape_independent_timecode
    timecode.sub(/\[\d+\]\s+/,'')
  end

  def time=(time)
    @timecode = nil
    @time = time
  end

  def time
    @time
  end

  # flag estimated timecodes and mark them accordingly when displaying
  def estimate!
    @estimated = true
  end

  def estimate?
    @estimated || false
  end

  def to_s
    (estimate? ? '~' : '') + timecode.sub(/\.\d\d$/,'')
  end

  def minimal
    (estimate? ? '~' : '') + TranslationValue.for('dictionary.timecode.minimal', I18n.locale, hours: timecode[0..1].gsub(/^0(.+)/, '\1'), minutes: timecode[3..4]) # timecode[0..1].gsub(/^0(.+)/, '\1') + "h " + timecode[3..4] + "min"
  end

  # calculates the numeric time difference in seconds
  def self.diff(timecode1, timecode2)
    time = 0
    t1, t2 = ([timecode1, timecode2].map do |timecode|
      if timecode.is_a?(String)
        # different tapes have 45 min time difference!
        tape = (timecode[/^\s*\[\d+\]/] || '').gsub(/[\s\[\]]/,'').to_i
        time = (tape == 0) ? 0 : 45 * 60 * (tape-1)
        time += Timecode.parse_timecode(timecode)
      else
        time = timecode.to_f
      end
      time
    end)
    (t2 - t1).round(3)
  end

  # yields the time in seconds from a timecode
  # supports HH:MM:SS, HH:MM:SS.mmm (ms), HH:MM:SS.ff (frames),
  # HH:MM:SS:mmm (colon ms), and HH:MM:SS:ff (colon frames)
  def self.parse_timecode(timecode)
    timecode.gsub!(/^\[\d{1,2}\]\s*/,'')
    duration_in_secs = 0
    milliseconds = (timecode[/\.\d{3}$/] || '0').to_f
    parts = timecode.split(':')
    # Handle colon-separated sub-seconds (HH:MM:SS:ff or HH:MM:SS:mmm)
    if parts.length == 4
      subsec = parts.pop
      if subsec.length == 2
        duration_in_secs += subsec.to_f / 25
      else
        duration_in_secs += subsec.to_f / 1000
      end
    end
    levels = [3600, 60, 1]
    parts.each_with_index do |part, index|
      duration_in_secs += (part[/^\d+/] || 0).to_f * levels[index]
    end
    duration_in_secs + milliseconds
  end

  # Formats a nonnegative duration after rounding to the nearest millisecond.
  #
  # @param time [Numeric, nil] Duration in seconds, defaulting to zero when absent
  # @return [String] Canonical timecode
  # @raise [ArgumentError] If the duration is negative or nonfinite
  def self.format_duration(time)
    time ||= 0
    raise ArgumentError, 'Timecode duration must be finite and nonnegative' unless time.finite? && !time.negative?

    # Round to the nearest millisecond and split into hours, minutes, seconds, and milliseconds
    total_milliseconds = (time * 1000).round
    total_seconds, milliseconds = total_milliseconds.divmod(1000)
    total_minutes, seconds = total_seconds.divmod(60)
    hours, minutes = total_minutes.divmod(60)
    format(
      '%<hours>02d:%<minutes>02d:%<seconds>02d.%<milliseconds>03d',
      hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds
    )
  end
end
