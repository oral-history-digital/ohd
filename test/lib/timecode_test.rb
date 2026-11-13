require 'test_helper'

class TimecodeTest < ActiveSupport::TestCase
  test 'carries rounded milliseconds into seconds, minutes, and hours' do
    {
      1.9996 => '00:00:02.000',
      59.9996 => '00:01:00.000',
      359_999.9996 => '100:00:00.000'
    }.each do |seconds, expected|
      assert_equal expected, Timecode.format_duration(seconds)
    end
  end

  test 'rejects durations that cannot represent a segment time' do
    [-0.001, Float::INFINITY, Float::NAN].each do |seconds|
      assert_raises(ArgumentError) { Timecode.format_duration(seconds) }
    end
  end

  test 'recognizes canonical segment timecodes' do
    %w[00:00:00.000 99:59:59.999 344:01:02.003].each do |value|
      assert Timecode.canonical?(value), value
    end
  end

  test 'rejects noncanonical segment timecodes' do
    [nil, '', 0, '0:01:02.003', '0344:01:02.003', '00:60:02.003',
     '00:01:60.003', '00:01:02', '00:01:02.03', '00:01:02.0030',
     '00:01:02:003', '00:01:02,003', ' 00:01:02.003', "00:01:02.003\n"].each do |value|
      refute Timecode.canonical?(value), value.inspect
    end
  end

  test 'import parser accepts canonical milliseconds without changing the value' do
    value = '344:01:02.003'.freeze

    assert_equal value, Timecode.parse_import(value)
  end

  test 'import parser converts frames at the selected source rate' do
    assert_equal '01:02:01.960', Timecode.parse_import('01:02:01:24', frame_rate: 25)
    assert_equal '01:02:01.800', Timecode.parse_import('01:02:01:24', frame_rate: 30)
    assert_equal '100:00:00.042', Timecode.parse_import('100:00:00:01', frame_rate: 24)
  end

  test 'import parser requires the syntax of the selected convention' do
    [nil, '', '01:02:01', '01:02:01.24', '01:02:01:24', '01:02:01,240', '01:60:01.240'].each do |value|
      assert_raises(Timecode::ImportFormatError) { Timecode.parse_import(value) }
    end

    ['01:02:01.24', '01:02:01.240', '01:02:01;24', '01:02:01:2', '01:02:60:24', "01:02:01:24\n"].each do |value|
      assert_raises(Timecode::ImportFormatError) { Timecode.parse_import(value, frame_rate: 25) }
    end
  end

  test 'import parser rejects out-of-range frames and unsupported rates' do
    error = assert_raises(Timecode::ImportFormatError) do
      Timecode.parse_import('01:02:01:24', frame_rate: 24)
    end
    assert_includes error.message, 'between 00 and 23'

    [0, 29.97, 25.0, '25'].each do |rate|
      assert_raises(Timecode::ImportFormatError) { Timecode.parse_import('01:02:01:12', frame_rate: rate) }
    end
  end

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

