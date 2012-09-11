require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Timecode, 'when parsing timecodes' do

  it 'should parse the "02:01:50.10" format correctly' do
    timecode = '[1] 02:01:50.10'
    time = 7200 + 110.4
    Timecode.parse_timecode(timecode).should == time
  end

  it 'should parse the "02:01:50" format correctly' do
    timecode = '[2] 02:01:50'
    time = 7200 + 110
    Timecode.parse_timecode(timecode).should == time
  end

end

describe Timecode, 'when computing diffs' do

  it 'should provide the seconds difference between two timecode strings' do
    timecode1 = '01:35:04'
    timecode2 = '01:42:01'
    Timecode.diff(timecode1, timecode2).should == (6 * 60) + 57
  end

  it 'should calculate a difference of exactly 45 min for same timecodes a tape apart' do
    timecode1 = '[1] 01:35:00'
    timecode2 = '[2] 01:35:00'
    Timecode.diff(timecode1, timecode2).should == 45 * 60
  end

  it 'should provide the difference between two time values' do
    timecode1 = 120
    timecode2 = 185
    Timecode.diff(timecode1, timecode2).should == (timecode2 - timecode1)
  end

  it 'should provide the difference between a timecode string and a time value' do
    timecode1 = '00:02:05'
    timecode2 = 180
    Timecode.diff(timecode1, timecode2).should == 55
  end

end