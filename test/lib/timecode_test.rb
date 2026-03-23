require 'test_helper'

class TimecodeTest < ActiveSupport::TestCase
  test 'should parse the "02:01:50.100" format correctly' do
    timecode = '[1] 02:01:50.100'
    time = 7200 + 110.1
    assert_equal time, Timecode.parse_timecode(timecode)
  end

  test 'should parse the "02:01:50.105" format correctly' do
    timecode = '[1] 02:01:50.105'
    time = 7200 + 110.105
    assert_equal time, Timecode.parse_timecode(timecode)
  end

  test 'should parse the "02:01:50" format correctly' do
    timecode = '[2] 02:01:50'
    time = 7200 + 110
    assert_equal time, Timecode.parse_timecode(timecode)
  end

  test 'should parse colon-separated ms format HH:MM:SS:mmm correctly' do
    assert_in_delta 90.5, Timecode.parse_timecode('00:01:30:500'), 0.001
  end

  test 'should parse colon-separated frames format HH:MM:SS:ff correctly' do
    assert_in_delta 1 + 12.0 / 25, Timecode.parse_timecode('00:00:01:12'), 0.001
  end

  test 'should parse colon-separated frames with tape prefix correctly' do
    assert_in_delta 1 + 12.0 / 25, Timecode.parse_timecode('[1] 00:00:01:12'), 0.001
  end
end

class TimecodeDiffTest < ActiveSupport::TestCase
  test 'should provide the seconds difference between two timecode strings' do
    timecode1 = '01:35:04'
    timecode2 = '01:42:01'
    assert_equal (6 * 60) + 57, Timecode.diff(timecode1, timecode2)
  end

  test 'should calculate a difference of exactly 45 min for same timecodes a tape apart' do
    timecode1 = '[1] 01:35:00'
    timecode2 = '[2] 01:35:00'
    assert_equal 45 * 60, Timecode.diff(timecode1, timecode2)
  end

  test 'should provide the difference between two time values' do
    timecode1 = 120
    timecode2 = 185
    assert_equal timecode2 - timecode1, Timecode.diff(timecode1, timecode2)
  end

  test 'should provide the difference between a timecode string and a time value' do
    timecode1 = '00:02:05'
    timecode2 = 180
    assert_equal 55, Timecode.diff(timecode1, timecode2)
  end
end

