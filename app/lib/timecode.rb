class Timecode
  # encapsulates Timecode-Formats and operations

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

  # yields the formatted timecode from a duration in secs
  def self.format_duration(time)
    return "00:00:00.000" unless time
    ms = ((time % 1) * 1000).round
    hours = (time / 3600).to_i
    mins = ((time - hours * 3600) / 60).to_i
    secs = (time - hours * 3600 - mins * 60).to_i
    "#{hours.to_s.rjust(2,'0')}:#{mins.to_s.rjust(2,'0')}:#{secs.to_s.rjust(2,'0')}.#{ms.to_s.rjust(3,'0')}"
  end

end
