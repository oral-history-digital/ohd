require 'test_helper'
require 'minitest/mock'

class EditTableTimecodeImportTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1, true)
  end

  test 'reports all malformed timestamps in one email and preserves the interview' do
    original = @interview.segments.pluck(:id, :timecode)
    tapes = @interview.tapes.pluck(:id)
    with_table(['00:01:54.00', '00:61:49.000']) do |path|
      assert_difference 'ActionMailer::Base.deliveries.count', 1 do
        ReadEditTableJob.perform_now(
          interview: @interview, file_path: path, locale: 'de',
          user: User.find_by!(email: 'alice@example.com'), only_references: 'false'
        )
      end
    end
    assert_equal original, @interview.segments.pluck(:id, :timecode)
    assert_equal tapes, @interview.tapes.pluck(:id)
    body = ActionMailer::Base.deliveries.last.text_part.decoded
    assert_includes body, 'Row 2'
    assert_includes body, 'Row 3'
    assert_includes body, 'Minutes must be between 00 and 59'
  end

  test 'rolls back deleted tapes when a write fails after validation' do
    original = @interview.segments.pluck(:id)
    tapes = @interview.tapes.pluck(:id)
    with_table(['00:00:01.000']) do |path|
      importer = EditTableImport.new(@interview, path, :de)
      importer.stub(:import_rows, -> { raise 'write failed' }) do
        assert_raises(RuntimeError) { importer.process }
      end
    end
    assert_equal original, @interview.segments.pluck(:id)
    assert_equal tapes, @interview.tapes.pluck(:id)
  end

  test 'references-only import reports missing target segments clearly' do
    with_table(['99:00:00.000']) do |path|
      error = assert_raises(Timecode::ImportFormatError) do
        EditTableImport.new(@interview, path, :de, true).process
      end
      assert_includes error.message, 'one existing segment'
    end
  end

  private

  # Writes an editing table with the interview's exported headers.
  # @param timecodes [Array<String>] Timecodes to place in consecutive rows
  # @yieldparam path [String] Temporary CSV path
  # @return [void]
  def with_table(timecodes)
    Tempfile.create(['edit-table', '.csv']) do |file|
      header = CSV.parse(EditTableImportTemplate.new(@interview, :de).csv, **CSV_OPTIONS).first
      csv = CSV.new(file, **CSV_OPTIONS)
      csv << header
      timecodes.each { |timecode| csv << [1, timecode, 'INT'] }
      csv.flush
      yield file.path
    end
  end
end
