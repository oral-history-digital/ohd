require 'test_helper'

class ReadTranscriptFileJobTest < ActiveSupport::TestCase
  setup do
    @interview = Project.find_by!(shortname: 'test').interviews.first
    @tape = @interview.tapes.first
    @user = User.find_by!(email: 'alice@example.com')
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
    assert_match(/row 3: timecode "00:01:54\.00"\. Use colons/, email.text_part.decoded)
    assert_match(/row 4: timecode "00:61:49\.000"\. Minutes must be between 00 and 59/, email.text_part.decoded)
    assert_match(/row 5: timecode "00:02:60\.000"\. Seconds must be between 00 and 59/, email.text_part.decoded)
    assert_match(/row 6: timecode "00:04:29:000"\. Use colons/, email.text_part.decoded)
    assert_includes email.text_part.decoded, 'a dot (.) followed by three millisecond digits'
    assert_includes email.html_part.decoded, '<br>'
    refute_includes email.text_part.decoded, 'transcript_spreadsheet_import.rb'
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
      assert_includes error.message, 'row 2'
      assert_includes error.message, 'row 3'
      assert_includes error.message, 'recognized speaker designation'
    end
  end

  test 'rejects timecodes that go backwards' do
    with_spreadsheet("100:00:00.000\t\tFirst\n99:59:59.999\t\tSecond\n") do |path|
      error = assert_raises(Timecode::ImportFormatError) do
        ReadTranscriptFileJob.new.perform(
          interview: @interview, tape_id: @tape.id, locale: 'eng', file_path: path
        )
      end
      assert_includes error.message, 'cannot be earlier than 100:00:00.000'
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

  private

  # Writes tab-delimited transcript rows to a temporary upload.
  #
  # @param rows [String] Source rows below the header
  # @yieldparam path [String] Temporary spreadsheet path
  # @return [void]
  def with_spreadsheet(rows)
    Tempfile.create(['transcript', '.csv']) do |file|
      file.write("TIMECODE\tSPEAKER\tTRANSCRIPT\n")
      file.write(rows)
      file.flush
      yield file.path
    end
  end
end
