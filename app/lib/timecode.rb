class Timecode
  # encapsulates Timecode-Formats and operations

  # Checks whether a value is in the canonical segment storage format.
  # Accepts timecodes in the format HH:MM:SS.mmm, where HH can be 2 or more
  # digits, MM and SS are 2 digits each, and mmm is 3 digits.
  #
  # @param value [Object] Candidate timecode
  # @return [Boolean] Whether the value can be stored as-is
  def self.canonical?(value)
    value.is_a?(String) && /\A(?:[0-9]{2}|[1-9][0-9]{2,}):[0-5][0-9]:[0-5][0-9]\.[0-9]{3}\z/.match?(value)
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
