require 'test_helper'
require 'minitest/mock'
require 'rake'
require 'csv'
require 'tempfile'

# Verifies read-only timecode classification and report contents.
class SegmentsAuditTest < ActiveSupport::TestCase
  # Loads the task in an isolated Rake application.
  # @return [void]
  def setup
    super
    @original_rake_application = Rake.application
    Rake.application = Rake::Application.new
    Rake::Task.define_task(:environment)
    load Rails.root.join('lib/tasks/segments.rake')
    @original_csv_path = ENV.delete('CSV_PATH')
    @projects = [
      Project.new(id: 42, shortname: 'abc', default_locale: 'de', archive_domain: 'https://archive.example'),
      Project.new(id: 43, shortname: 'def', default_locale: 'en', archive_domain: nil)
    ]
  end

  # Restores the application's task registry.
  # @return [void]
  def teardown
    Rake.application = @original_rake_application
    ENV.delete('CSV_PATH')
    ENV['CSV_PATH'] = @original_csv_path if @original_csv_path
    super
  end

  test 'reports format groups and identifiers without modifying records' do
    examples = {
      '00:01:02.003' => nil,
      '100:00:00.000' => nil,
      '344:00:00.000' => nil,
      '9999:00:00.000' => nil,
      '00:01:02,003' => 'comma separator',
      '00:01:02:12' => 'likely frames (25 fps; ambiguous)',
      '00:01:02.12' => 'likely frames (25 fps; ambiguous)',
      '00:01:02:25' => 'two fractional digits outside 25 fps frame range',
      '00:01:02:003' => 'colon-separated milliseconds',
      '00:01:02' => 'missing milliseconds',
      '00:01:02.1234' => 'other fractional precision or separator',
      '0:01:02.003' => 'nonstandard hours width',
      ' 00:01:02.003 ' => 'surrounding whitespace',
      '[1] 00:01:02.003' => 'tape prefix',
      '00:60:02.003' => 'invalid minutes',
      '' => 'empty',
      nil => 'empty',
      'unknown' => 'unrecognized'
    }
    rows = examples.keys.each_with_index.map do |value, index|
      # Frozen readers expose no persistence methods: any write fails the test.
      Struct.new(:id, :timecode, :audit_archive_id, :audit_project_id)
        .new(index + 1, value, 'abc001', 42).freeze
    end
    scope = Minitest::Mock.new
    scope.expect(:select, scope, [
      'segments.id, segments.timecode, interviews.archive_id AS audit_archive_id, interviews.project_id AS audit_project_id'
    ])
    scope.expect(:find_each, nil) do |&block|
      rows.each(&block)
      true
    end

    output = nil
    Segment.stub(:joins, ->(association) {
      assert_equal :interview, association
      scope
    }) do
      Project.stub(:all, @projects) do
        output, = capture_io { Rake::Task['segments:audit_timecodes'].invoke }
      end
    end
    scope.verify

    assert_includes output, 'Scanned: 18; standard: 4; nonstandard: 14'
    examples.values.compact.uniq.each { |type| assert_includes output, "#{type}:" }
    assert_includes output, 'likely frames (25 fps; ambiguous): 2'
    assert_includes output, 'empty: 2'
    assert_includes output, 'segment=5 archive_id="abc001" project_id=42 timecode="00:01:02,003"'
    assert_not_includes output, 'segment=1 '
    assert_includes output, 'url=https://archive.example/de/interviews/abc001'
    assert_includes output, 'CSV_PATH=tmp/timecode_audit.csv'
    rows.each_with_index { |row, index| assert_equal examples.keys[index].inspect, row.timecode.inspect }
  end

  test 'reports an empty database' do
    scope = Minitest::Mock.new
    scope.expect(:select, scope, [String])
    scope.expect(:find_each, nil)
    Segment.stub(:joins, scope) do
      Project.stub(:all, @projects) do
        output, = capture_io { Rake::Task['segments:audit_timecodes'].invoke }
        assert_includes output, "Scanned: 0; standard: 0; nonstandard: 0\n"
      end
    end
    scope.verify
  end

  test 'reports overlapping padding and suffix issues but exports each segment once' do
    examples = {
      '00:00:021.190' => ['extra leading zeros in seconds'],
      '00:00:021.19' => ['extra leading zeros in seconds', 'likely frames (25 fps; ambiguous)'],
      '000:001:021.19' => ['extra leading zeros in hours', 'extra leading zeros in minutes',
                           'extra leading zeros in seconds', 'likely frames (25 fps; ambiguous)'],
      '00:000:000.000' => ['extra leading zeros in minutes', 'extra leading zeros in seconds'],
      '00:00:021,190' => ['extra leading zeros in seconds', 'comma separator'],
      '00:060:021.190' => ['nonstandard minutes width', 'invalid minutes', 'extra leading zeros in seconds'],
      '00:00:121.190' => ['nonstandard seconds width', 'invalid seconds'],
      '0100:00:00.000' => ['extra leading zeros in hours'],
      '0344:00:00.000' => ['extra leading zeros in hours'],
      '00:0344:00.000' => ['nonstandard minutes width', 'invalid minutes'],
      '00:00:0344.000' => ['nonstandard seconds width', 'invalid seconds'],
      '00:1:2.000' => ['nonstandard minutes width', 'nonstandard seconds width'],
      " [1] 00:00:021.19 " => ['surrounding whitespace', 'tape prefix', 'extra leading zeros in seconds',
                               'likely frames (25 fps; ambiguous)']
    }
    rows = examples.keys.each_with_index.map do |value, index|
      Struct.new(:id, :timecode, :audit_archive_id, :audit_project_id)
        .new(index + 1, value.freeze, 'abc001', 42).freeze
    end
    scope = Minitest::Mock.new
    scope.expect(:select, scope, [String])
    scope.expect(:find_each, nil) do |&block|
      rows.each(&block)
      true
    end

    Tempfile.create(['timecode-issues', '.csv']) do |file|
      ENV['CSV_PATH'] = file.path
      Segment.stub(:joins, scope) do
        Project.stub(:all, @projects) do
          output, = capture_io { Rake::Task['segments:audit_timecodes'].invoke }
          assert_includes output, 'Scanned: 13; standard: 0; nonstandard: 13'
          assert_includes output, 'category counts overlap'
          assert_includes output, 'extra leading zeros in seconds: 7'
          assert_includes output, 'likely frames (25 fps; ambiguous): 3'
          assert_equal 2, output.lines.count { |line| line.start_with?('  segment=2 ') }
        end
      end
      exported = CSV.read(file.path, headers: true)
      assert_equal examples.length, exported.length
      assert_equal examples.length, exported.map { |row| row['segment_id'] }.uniq.length
      exported.each do |row|
        assert_equal examples.fetch(row['timecode']).sort, row['issues'].split(' | ').sort
      end
    end
    scope.verify
  end

  test 'limits console examples while exporting every finding with project URLs' do
    rows = (1..7).map do |id|
      Struct.new(:id, :timecode, :audit_archive_id, :audit_project_id)
        .new(id, '00:01:02,003', 'def001', 43).freeze
    end
    scope = Minitest::Mock.new
    scope.expect(:select, scope, [String])
    scope.expect(:find_each, nil) do |&block|
      rows.each(&block)
      true
    end

    Tempfile.create(['timecode-audit', '.csv']) do |file|
      ENV['CSV_PATH'] = file.path
      Segment.stub(:joins, scope) do
        Project.stub(:all, @projects) do
          output, = capture_io { Rake::Task['segments:audit_timecodes'].invoke }
          assert_includes output, 'comma separator: 7'
          assert_equal 5, output.lines.count { |line| line.start_with?('  segment=') }
          assert_includes output, '... 2 more'
          assert_includes output, "url=#{OHD_DOMAIN}/def/en/interviews/def001"
        end
      end
      exported = CSV.read(file.path, headers: true)
      assert_equal 7, exported.length
      assert_equal (1..7).map(&:to_s), exported.map { |row| row['segment_id'] }
      exported.each do |row|
        assert_equal 'def', row['project_shortname']
        assert_equal '00:01:02,003', row['timecode']
        assert_equal 'comma separator', row['issues']
        assert_equal "#{OHD_DOMAIN}/def/en/interviews/def001", row['interview_url']
      end
    end
    scope.verify
  end
end
