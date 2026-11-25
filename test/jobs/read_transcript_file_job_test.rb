require 'test_helper'
require 'minitest/mock'

class ReadTranscriptFileJobTest < ActiveSupport::TestCase
  setup do
    @interview = Project.find_by!(shortname: 'test').interviews.first
    @tape = @interview.tapes.first
    @user = User.find_by!(email: 'alice@example.com')
  end

  test 'spreadsheet validation matches proposed speakers without saving them or replacing segments' do
    contribution = @interview.contributions.first
    original = contribution.speaker_designation
    segment = @tape.segments.first
    original_segments = @tape.segments.pluck(:id, :timecode)
    options = {
      delete_existing: false,
      contributions_attributes: { '0' => { id: contribution.id, speaker_designation: 'PROPOSED' } }
    }
    with_spreadsheet("#{segment.timecode}\tPROPOSED\tUpdated text\n") do |path|
      writes = []
      subscriber = ->(*event) do
        sql = event.last[:sql]
        writes << sql if sql.match?(/\A\s*(INSERT|UPDATE|DELETE)\b/i)
      end
      ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
        rows = TranscriptSpreadsheetImport.new(@tape, 'eng', options).validate!(path)
        assert_equal contribution.person_id, rows.first[:speaker_id]
        assert_equal segment.id, rows.first[:segment].id
      end
      assert_empty writes
    end
    assert_equal original, contribution.reload.speaker_designation
    assert_equal original_segments, @tape.segments.pluck(:id, :timecode)
  end

  test 'emails ODT timing errors once and preserves the transcript' do
    reported = []
    render_codes = lambda do |issues, _locale|
      reported.replace(issues)
      issues.map { |issue| issue[:code] }.join("\n")
    end
    ImportValidationMessages.stub(:render, render_codes) do
      original = @tape.segments.pluck(:id)
      assert_difference 'ActionMailer::Base.deliveries.count', 1 do
        with_upload('unused', '.odt') do |path|
          ReadTranscriptFileJob.perform_now(
            interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path,
            filename: 'transcript.odt', user: @user, delete_existing: true,
            tape_durations: '00:61:00', time_shifts: '00:00:60'
          )
        end
      end
      assert_equal original, @tape.segments.pluck(:id)
      body = ActionMailer::Base.deliveries.last.text_part.decoded
      assert_equal %w[odt.timing_format odt.timing_format], reported.map { |issue| issue[:code] }
      assert_equal %w[duration time_shift], reported.map { |issue| issue[:location][:field] }
      assert_equal %w[00:61:00 00:00:60], reported.map { |issue| issue[:params][:value] }
      assert_includes body, 'odt.timing_format'
    end
  end

  test 'replaces a transcript with canonical timecodes converted from frames' do
    with_spreadsheet(" 00:00:01:24 \t\tFirst\n00:00:03:00\t\tSecond\n") do |path|
      ReadTranscriptFileJob.new.perform(
        interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path,
        frame_rate: '25', trim_timecodes: 'true', delete_existing: 'true'
      )
    end

    assert_equal %w[00:00:01.960 00:00:03.000], @tape.segments.order(:timecode).pluck(:timecode)
    assert_equal 'First', @tape.segments.find_by!(timecode: '00:00:01.960').text('eng')
  end

  test 'emails all invalid timecodes once and preserves the old transcript' do
    reported = []
    render_codes = lambda do |issues, _locale|
      reported.replace(issues)
      issues.map { |issue| issue[:code] }.join("\n")
    end
    ImportValidationMessages.stub(:render, render_codes) do
      original = @tape.segments.pluck(:id, :timecode)
      rows = "00:00:01.000\t\tFirst\n00:01:54.00\t\tSecond\n" \
             "00:61:49.000\t\tThird\n00:02:60.000\t\tFourth\n00:04:29:000\t\tFifth\n"
      assert_difference 'ActionMailer::Base.deliveries.count', 1 do
        with_spreadsheet(rows) do |path|
          ReadTranscriptFileJob.perform_now(
            interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path,
            filename: 'transcript.csv', user: @user, delete_existing: true
          )
        end
      end

      assert_equal original, @tape.segments.pluck(:id, :timecode)
      email = ActionMailer::Base.deliveries.last
      assert_equal [@user.email], email.to
      assert_includes email.text_part.decoded, 'transcript.csv'
      assert_equal %w[timecode.milliseconds_format timecode.minutes_out_of_range timecode.seconds_out_of_range timecode.milliseconds_format],
                   reported.map { |issue| issue[:code] }
      assert_equal [3, 4, 5, 6], reported.map { |issue| issue[:location][:row] }
      assert_equal %w[00:01:54.00 00:61:49.000 00:02:60.000 00:04:29:000], reported.map { |issue| issue[:params][:value] }
      reported.each { |issue| assert_includes email.text_part.decoded, issue[:code] }
      assert_includes email.html_part.decoded, '<br>'
      refute_includes email.text_part.decoded, 'transcript_spreadsheet_import.rb'
    end
  end

  test 'replaces a transcript with separate segments for rows that share a timecode' do
    with_spreadsheet("00:00:01.000\t\tFirst\n00:00:01.000\t\tSecond\n") do |path|
      ReadTranscriptFileJob.new.perform(
        interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path, delete_existing: true
      )
    end

    segments = @tape.segments.reorder(:id)
    assert_equal %w[00:00:01.000 00:00:01.000], segments.pluck(:timecode)
    assert_equal %w[First Second], segments.map { |segment| segment.text('eng') }
  end

  test 'updates segments with the same timecode by matching their speakers' do
    first_speaker, second_speaker = @interview.contributions.order(:id).to_a
    first_speaker.update!(speaker_designation: 'IP_MH')
    second_speaker.update!(speaker_designation: 'INT_NM')
    first = @tape.segments.first
    first.update!(timecode: '00:31:15.000', speaker_id: first_speaker.person_id)
    second = @tape.segments.create!(
      interview: @interview, timecode: first.timecode, speaker_id: second_speaker.person_id
    )

    with_spreadsheet("00:31:15.000\tINT_NM\tSecond speaker\n00:31:15.000\tIP_MH\tFirst speaker\n") do |path|
      assert_no_difference 'Segment.count' do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path
        )
      end
    end

    assert_equal 'First speaker', first.reload.text('eng')
    assert_equal 'Second speaker', second.reload.text('eng')
  end

  test 'rejects shared timecodes without identifiable speakers in update mode' do
    with_spreadsheet("00:00:01.000\t\tFirst\n 00:00:01.000 \t\tSecond\n") do |path|
      error = assert_raises(Timecode::ImportFormatError) do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path, trim_timecodes: true
        )
      end
      assert_equal [2, 3], error.issues.map { |issue| issue[:location][:row] }
      assert_equal ['segment.ambiguous'], error.issues.map { |issue| issue[:code] }.uniq
    end
  end

  test 'rejects timecodes that go backwards' do
    with_spreadsheet("100:00:00.000\t\tFirst\n99:59:59.999\t\tSecond\n") do |path|
      error = assert_raises(Timecode::ImportFormatError) do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path
        )
      end
      assert_equal 'timecode.out_of_order', error.issues.first[:code]
      assert_equal '100:00:00.000', error.issues.first[:params][:previous]
    end
  end

  test 'rejects a tape belonging to another project before replacing segments' do
    project = Project.find_by!(shortname: 'ohd')
    other = Interview.create!(project: project, archive_id: 'ohd999', media_type: 'audio')
    other_tape = Tape.create!(interview: other, number: 1, media_id: 'ohd999_01_01')
    existing = other_tape.segments.create!(interview: other, timecode: '00:00:00.000')

    with_spreadsheet("00:00:01.000\t\tFirst\n") do |path|
      assert_raises(ActiveRecord::RecordNotFound) do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: other_tape.id, locale: 'eng', file_path: path, delete_existing: true
        )
      end
    end

    assert_equal [existing.id], other_tape.segments.pluck(:id)
  end

  test 'imports VTT cues with short timestamps and keeps their explicit duration' do
    content = <<~VTT
      WEBVTT

      NOTE This is metadata

      cue-1
      00:01.500 --> 00:03.750 align:start
      First line
      Second line
    VTT
    with_upload(content, '.vtt') do |path|
      ReadTranscriptFileJob.new.perform(
        interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path, delete_existing: true
      )
    end

    segment = @tape.segments.sole
    assert_equal '00:00:01.500', segment.timecode
    assert_equal 2.25, segment.duration
    assert_includes segment.text('eng'), 'Second line'
  end

  test 'imports SRT commas and hours above 99 without converting timestamps inside the text' do
    content = "1\r\n100:00:01,000 --> 100:00:02,250\r\nMention 00:00:15,250 in the cue.\r\n"
    with_upload(content, '.srt') do |path|
      ReadTranscriptFileJob.new.perform(
        interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path, delete_existing: true
      )
    end

    segment = @tape.segments.sole
    assert_equal '100:00:01.000', segment.timecode
    assert_equal 1.25, segment.duration
    assert_equal 'Mention 00:00:15,250 in the cue.', segment.text('eng')
  end

  test 'emails invalid VTT boundaries and preserves existing segments during replacement' do
    reported = []
    render_codes = lambda do |issues, _locale|
      reported.replace(issues)
      issues.map { |issue| issue[:code] }.join("\n")
    end
    ImportValidationMessages.stub(:render, render_codes) do
      content = <<~VTT
        WEBVTT

        00:61:49.000 --> 00:01:54.00
        Bad start and end

        00:00:05.000 --> 00:00:04.000
        Reversed cue
      VTT
      original = @tape.segments.pluck(:id, :timecode)
      assert_difference 'ActionMailer::Base.deliveries.count', 1 do
        with_upload(content, '.vtt') do |path|
          ReadTranscriptFileJob.perform_now(
            interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path,
            filename: 'transcript.vtt', user: @user, delete_existing: true
          )
        end
      end

      assert_equal original, @tape.segments.pluck(:id, :timecode)
      body = ActionMailer::Base.deliveries.last.text_part.decoded
      assert_equal %w[timecode.minutes_out_of_range subtitle.vtt_format subtitle.interval], reported.map { |issue| issue[:code] }
      assert_equal [3, 3, 6], reported.map { |issue| issue[:location][:line] }
      assert_equal %w[start end], reported.first(2).map { |issue| issue[:location][:field] }
      assert_equal({ start: '00:00:05.000', end: '00:00:04.000' }, reported.last[:params])
      reported.each { |issue| assert_includes body, issue[:code] }
      refute_includes body, 'transcript_subtitle_reader.rb'
    end
  end

  test 'reports the comma requirement for a malformed SRT timestamp' do
    with_upload("1\n00:00:01.000 --> 00:00:02,000\nText\n", '.srt') do |path|
      error = assert_raises(Timecode::ImportFormatError) do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path
        )
      end
      assert_equal 'subtitle.srt_format', error.issues.first[:code]
      assert_equal({ line: 2, field: 'start' }, error.issues.first[:location])
      assert_equal '00:00:01.000', error.issues.first[:params][:value]
    end
  end

  private

  # Writes tab-delimited transcript rows to a temporary upload.
  #
  # @param rows [String] Source rows below the header
  # @yieldparam path [String] Temporary spreadsheet path
  # @return [void]
  def with_spreadsheet(rows)
    with_upload("TIMECODE\tSPEAKER\tTRANSCRIPT\n#{rows}", '.csv') { |path| yield path }
  end

  # Writes a temporary upload for the job to read.
  #
  # @param content [String] File contents
  # @param extension [String] Extension indicating the import format
  # @yieldparam path [String] Temporary upload path
  # @return [void]
  def with_upload(content, extension)
    Tempfile.create(['transcript', extension]) do |file|
      file.write(content)
      file.flush
      yield file.path
    end
  end
end
