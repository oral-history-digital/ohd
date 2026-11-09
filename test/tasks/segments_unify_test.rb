require 'test_helper'
require 'minitest/mock'
require 'rake'

# Verifies persisted normalization, repeat runs, and per-record failures.
class SegmentsUnifyTest < ActiveSupport::TestCase
  # Loads segment tasks without modifying the application's task registry.
  # @return [void]
  def setup
    super
    @original_rake_application = Rake.application
    Rake.application = Rake::Application.new
    Rake::Task.define_task(:environment)
    load Rails.root.join('lib/tasks/segments.rake')
    @original_dry_run = ENV.delete('DRY_RUN')
  end

  # Restores the application's task registry.
  # @return [void]
  def teardown
    Rake.application = @original_rake_application
    ENV.delete('DRY_RUN')
    ENV['DRY_RUN'] = @original_dry_run if @original_dry_run
    super
  end

  test 'persists known formats while preserving invalid values and unrelated attributes' do
    project = DataHelper.test_project(shortname: 'uf')
    interview = Interview.create!(project: project, archive_id: 'uf123', media_type: 'audio')
    tape = Tape.create!(interview: interview, media_id: 'uf123_01', number: 1)
    inputs = ['00:01:02,003', '00:00:01:12', '00:01:02.003', '00:00:01.12345', nil]
    Segment.insert_all!(inputs.map do |timecode|
      { interview_id: interview.id, tape_id: tape.id, timecode: timecode, duration: 2.5,
        created_at: Time.current, updated_at: Time.current }
    end)
    scope = Segment.where(interview_id: interview.id).order(:id)
    before = scope.map(&:attributes)

    ENV['DRY_RUN'] = 'true'
    Segment.stub(:select, scope.select(:id, :timecode)) do
      output, = capture_io { Rake::Task['segments:unify_timecodes'].execute }
      assert_includes output, 'Dry run: no database changes will be made.'
      assert_includes output, '2 segments would change; 1 unchanged; 2 rejected; 0 failed.'
    end
    assert_equal before, scope.reload.map(&:attributes)
    ENV['DRY_RUN'] = 'false'

    Segment.stub(:select, scope.select(:id, :timecode)) do
      output, = capture_io { Rake::Task['segments:unify_timecodes'].execute }
      assert_includes output, '2 segments updated; 1 unchanged; 2 rejected; 0 failed.'
      assert_includes output, '"00:00:01:12" -> "00:00:01.480"'
    end

    after = scope.reload.map(&:attributes)
    assert_equal ['00:01:02.003', '00:00:01.480', '00:01:02.003', '00:00:01.12345', nil],
                 after.map { |attributes| attributes['timecode'] }
    assert_equal before.map { |attributes| attributes.except('timecode') },
                 after.map { |attributes| attributes.except('timecode') }

    Segment.stub(:select, scope.select(:id, :timecode)) do
      output, = capture_io { Rake::Task['segments:unify_timecodes'].execute }
      assert_includes output, '0 segments updated; 3 unchanged; 2 rejected; 0 failed.'
    end
    assert_equal after, scope.reload.map(&:attributes)
  end

  test 'reports raised and unsuccessful writes and continues processing' do
    records = (1..3).map do |id|
      record = Minitest::Mock.new
      record.expect(:timecode, '00:00:01,500')
      record.expect(:id, id)
      record
    end
    records[0].expect(:update_columns, nil) do |**attributes|
      assert_equal({ timecode: '00:00:01.500' }, attributes)
      raise ActiveRecord::StatementInvalid, 'write failed'
    end
    records[1].expect(:update_columns, false, [], timecode: '00:00:01.500')
    records[2].expect(:update_columns, true, [], timecode: '00:00:01.500')
    scope = Minitest::Mock.new
    scope.expect(:find_each, nil) do |&block|
      records.each(&block)
      true
    end

    Segment.stub(:select, scope) do
      output, = capture_io { Rake::Task['segments:unify_timecodes'].execute }
      assert_includes output, 'Failed segment #1: "00:00:01,500" (write failed)'
      assert_includes output, 'Failed segment #2: "00:00:01,500" (Timecode update returned false)'
      assert_includes output, 'Segment #3: "00:00:01,500" -> "00:00:01.500"'
      assert_includes output, '1 segments updated; 0 unchanged; 0 rejected; 2 failed.'
    end
    records.each(&:verify)
    scope.verify
  end

  test 'dry run previews conversions without issuing writes' do
    ENV['DRY_RUN'] = 'true'
    # These frozen readers have no persistence methods: any write fails the test.
    records = ['00:00:01,500', '00:00:01.500', 'unknown'].each_with_index.map do |value, index|
      Struct.new(:id, :timecode).new(index + 1, value.freeze).freeze
    end
    scope = Minitest::Mock.new
    scope.expect(:find_each, nil) do |&block|
      records.each(&block)
      true
    end

    Segment.stub(:select, scope) do
      output, = capture_io { Rake::Task['segments:unify_timecodes'].execute }
      assert_includes output, 'Would update segment #1: "00:00:01,500" -> "00:00:01.500"'
      assert_includes output, 'Rejected segment #3: "unknown"'
      assert_includes output, '1 segments would change; 1 unchanged; 1 rejected; 0 failed.'
      assert_not_includes output, 'segments updated'
    end
    scope.verify
  end
end
