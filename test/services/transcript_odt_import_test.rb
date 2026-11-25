require 'test_helper'
require 'minitest/mock'

class TranscriptOdtImportTest < ActiveSupport::TestCase
  setup do
    @interview = Project.find_by!(shortname: 'test').interviews.first
    @tape = @interview.tapes.first
  end

  test 'reports both malformed timing fields before replacing segments' do
    original = @tape.segments.pluck(:id)
    error = assert_raises(Timecode::ImportFormatError) do
      TranscriptOdtImport.new(@tape, 'eng', {
        tape_durations: '00:61:00', time_shifts: '00:00:60', delete_existing: true
      }).call('unused.odt')
    end
    assert_includes error.message, "Tape #{@tape.number}: Invalid duration"
    assert_includes error.message, "Tape #{@tape.number}: Invalid time shift"
    assert_equal original, @tape.segments.pluck(:id)
  end

  test 'requires a duration and a positive interval' do
    ['', '00:00:10'].each do |duration|
      assert_raises(Timecode::ImportFormatError) do
        TranscriptOdtImport.new(@tape, 'eng', {
          tape_durations: duration, time_shifts: '00:00:10'
        }).call('unused.odt')
      end
    end
  end

  test 'rolls back tape timing and deleted segments when text processing fails' do
    original_timing = @tape.attributes.slice('duration', 'time_shift')
    original_segments = @tape.segments.pluck(:id)
    @interview.stub(:create_or_update_segments_from_text, ->(*) { raise 'Text conversion failed' }) do
      assert_raises(RuntimeError) do
        TranscriptOdtImport.new(@tape, 'eng', {
          tape_durations: '00:10:00', time_shifts: '00:00:30', delete_existing: true
        }).call('unused.odt')
      end
    end
    assert_equal original_timing, @tape.reload.attributes.slice('duration', 'time_shift')
    assert_equal original_segments, @tape.segments.pluck(:id)
  end

  test 'applies settings before importing text and defaults the shift to zero' do
    @interview.stub(:create_or_update_segments_from_text, lambda { |path, id, locale|
      assert_equal ['upload.odt', @tape.id, 'eng'], [path, id, locale]
      assert_equal 600, @tape.reload.duration
      assert_equal 0, @tape.time_shift
    }) do
      TranscriptOdtImport.new(@tape, 'eng', { tape_durations: '00:10:00' }).call('upload.odt')
    end
  end
end
