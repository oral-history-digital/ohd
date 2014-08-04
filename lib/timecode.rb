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
    (estimate? ? '~' : '') + I18n.t('dictionary.timecode.minimal', :hours => timecode[0..1].gsub(/^0(.+)/, '\1'), :minutes => timecode[3..4]) # timecode[0..1].gsub(/^0(.+)/, '\1') + "h " + timecode[3..4] + "min"
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
  # needs to work for both '00:00:00.00' and '00:00:00' formats!
  def self.parse_timecode(time)
    time.gsub!(/^\[\d{1,2}\]\s*/,'')
    duration_in_secs = (time[/\.\d{2}$/] || '0').sub('.','').to_f / 25
    levels = [3600, 60, 1, 0.01]
    time.split(':').each_with_index do |part,index|
      duration_in_secs += (part[/^\d+/] || 0).to_f * levels[index]
    end
    duration_in_secs
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
