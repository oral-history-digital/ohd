class Timecode
  # encapsulates Timecode-Formats and operations

  def initialize(time=nil)
    @time = case time
      when String
        @timecode = time
        Timecode::parse_timecode(time)
      when Fixnum, Float then time
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
    (estimate? ? '~' : '') + timecode[0..1].gsub(/^0(.+)/, '\1') + "h " + timecode[3..4] + "min"
  end

  # yields the time in seconds from a timecode
  def self.parse_timecode(time)
    time.gsub!(/^\[\d{1,2}\]\s*/,'')
    duration_in_secs =  (time[/\d{2}$/] || 0).to_f / 25
    duration_in_secs += ((time[/\d{2}(\.|,)\d{2}$/] || 0)[/^\d{2}/]).to_f
    duration_in_secs += ((time[/^\d{2}:\d{2}/] || 0)[/\d{2}$/]).to_f * 60
    duration_in_secs += (time[/^\d{2}/] || 0).to_f * 3600
  end

  # yields the formatted timecode from a duration in secs
  def self.format_duration(time)
    frames = ((time % 1) * 25).to_i
    hours = (time / 3600).to_i
    mins = ((time - hours * 3600) / 60).to_i
    secs = (time - hours * 3600 - mins * 60).to_i
    "#{hours.to_s.rjust(2,'0')}:#{mins.to_s.rjust(2,'0')}:#{secs.to_s.rjust(2,'0')}.#{frames.to_s.rjust(2,'0')}"
  end

end
