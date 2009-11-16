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
    Timecode::format_duration(@time, true)
  end

  # yields the time in seconds from a timecode
  def self.parse_timecode(time)
    duration_in_secs =  time[/\d{2}$/].to_f / 25
    duration_in_secs += time[/\d{2}(\.|,)\d{2}$/][/^\d{2}/].to_f
    duration_in_secs += time[/^\d{2}:\d{2}/][/\d{2}$/].to_f * 60
    duration_in_secs += time[/^\d{2}/].to_f * 3600
  end

  # yields the formatted timecode from a duration in secs
  def self.format_duration(time, verbose = false)
    frames = ((time % 1) * 25).to_i
    hours = (time / 3600).to_i
    mins = ((time - hours * 3600) / 60).to_i
    secs = (time - hours * 3600 - mins * 60).to_i
    if verbose
      verbose_format(hours, mins, secs)
    else
      standard_format(hours, mins, secs, frames)
    end
  end

  def self.standard_format(hours, mins, secs, frames)
    "#{hours.to_s.rjust(2,'0')}:#{mins.to_s.rjust(2,'0')}:#{secs.to_s.rjust(2,'0')}.#{frames.to_s.rjust(2,'0')}"
  end

  def self.verbose_format(hours, mins, secs)
    time_display = ''
    time_display << hours.to_s + ' h ' unless hours == 0
    time_display << mins.to_s + ' min ' unless mins == 0 && hours == 0
    time_display << secs.to_s + ' s' unless secs == 0 && (mins != 0 || hours != 0)
    time_display
  end

end