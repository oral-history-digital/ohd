require 'test_helper'
require 'minitest/mock'

# Checks retries independently of the worker's global single-attempt setting.
class RefreshSearchIndexJobTest < ActiveJob::TestCase
  test 'failed Solr commits retry three times in total and then surface the error' do
    failure = ->(*) { raise solr_error }
    job = RefreshSearchIndexJob.new({})

    Sunspot.stub(:commit, failure) do
      2.times do
        assert_enqueued_jobs 1, only: RefreshSearchIndexJob do
          job.perform_now
        end
        queued = enqueued_jobs.pop
        assert_equal 'indexing', queued.fetch(:queue)
        assert_equal 50, queued.fetch(:priority)
        assert_operator queued.fetch(:at), :>, Time.current.to_f
        job = ActiveJob::Base.deserialize(queued)
      end

      assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
        error = assert_raises(RefreshSearchIndexJob::IndexingError) { job.perform_now }
        assert_includes error.message, 'RSolr::Error::Http'
        refute_includes error.message, 'private interview text'
        assert_nil error.cause
      end
    end
  end

  test 'index failures also retry and never commit a failed batch' do
    Sunspot.stub(:index, ->(*) { raise solr_error }) do
      Sunspot.stub(:commit, ->(*) { flunk 'Must not commit after a failed index update' }) do
        assert_enqueued_with(job: RefreshSearchIndexJob, args: [{ 'Person' => [Person.first.id] }]) do
          RefreshSearchIndexJob.perform_now('Person' => [Person.first.id])
        end
      end
    end
  end

  test 'connection failures retry but programming errors do not' do
    Sunspot.stub(:commit, ->(*) { raise Errno::ECONNREFUSED }) do
      assert_enqueued_with(job: RefreshSearchIndexJob, args: [{}]) do
        RefreshSearchIndexJob.perform_now({})
      end
    end

    assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
      assert_raises(KeyError) { RefreshSearchIndexJob.perform_now('UnsupportedModel' => [1]) }
    end
  end

  test 'dedicated log records successful attempts with IDs and duration only' do
    person = Person.first
    job = RefreshSearchIndexJob.new('Person' => [person.id])

    with_indexing_log do |output|
      Sunspot.stub(:index, ->(*) {}) do
        Sunspot.stub(:commit, -> {}) { job.perform_now }
      end

      entries = output.string.lines.map { |line| JSON.parse(line) }
      assert_equal(%w[start success], entries.map { |entry| entry.fetch('event') })
      entries.each do |entry|
        assert_equal job.job_id, entry.fetch('job_id')
        assert_equal 1, entry.fetch('attempt')
        assert_equal({ 'Person' => [person.id] }, entry.fetch('targets'))
        assert Time.iso8601(entry.fetch('timestamp'))
      end
      assert_operator entries.last.fetch('duration_ms'), :>=, 0
      refute_includes output.string, person.first_name
      assert_equal %w[attempt duration_ms event job_id targets timestamp], entries.last.keys.sort
    end
  end

  test 'dedicated log records every failed retry without exception payloads' do
    job = RefreshSearchIndexJob.new({})

    with_indexing_log do |output|
      Sunspot.stub(:commit, -> { raise solr_error }) do
        2.times do
          job.perform_now
          job = ActiveJob::Base.deserialize(enqueued_jobs.pop)
        end
        assert_raises(RefreshSearchIndexJob::IndexingError) { job.perform_now }
      end

      entries = output.string.lines.map { |line| JSON.parse(line) }
      assert_equal(%w[start failure start failure start failure], entries.map { |entry| entry.fetch('event') })
      assert_equal([1, 1, 2, 2, 3, 3], entries.map { |entry| entry.fetch('attempt') })
      entries.select { |entry| entry['event'] == 'failure' }.each do |entry|
        assert_equal 'RefreshSearchIndexJob::IndexingError', entry.fetch('error')
        assert_operator entry.fetch('duration_ms'), :>=, 0
      end
      refute_includes output.string, 'private interview text'
      refute_includes output.string, 'IndexWriter is closed'
      refute_includes output.string, 'solr.invalid'
    end
  end

  test 'dedicated log excludes unknown target names and programming error messages' do
    with_indexing_log do |output|
      assert_raises(KeyError) { RefreshSearchIndexJob.perform_now('private interview text' => [1]) }
      entries = output.string.lines.map { |line| JSON.parse(line) }
      assert_equal(%w[start failure], entries.map { |entry| entry.fetch('event') })
      assert_equal({}, entries.last.fetch('targets'))
      assert_equal 'KeyError', entries.last.fetch('error')
      refute_includes output.string, 'private interview text'
    end
  end

  test 'an unavailable dedicated log does not prevent indexing' do
    committed = false
    warnings = []
    RefreshSearchIndexJob.stub(:indexing_logger, -> { raise Errno::EACCES }) do
      Rails.logger.stub(:warn, ->(message) { warnings << message }) do
        Sunspot.stub(:commit, -> { committed = true }) { RefreshSearchIndexJob.perform_now({}) }
      end
    end
    assert committed
    assert_equal ['Solr indexing log unavailable (Errno::EACCES)'] * 2, warnings
  end

  private

  # Captures lifecycle entries without adding test data to the shared log file.
  # @yieldparam output [StringIO] Captured log output
  # @return [void]
  def with_indexing_log
    output = StringIO.new
    logger = Logger.new(output, formatter: ->(_severity, _time, _program, message) { "#{message}\n" })
    RefreshSearchIndexJob.stub(:indexing_logger, logger) { yield output }
  ensure
    logger&.close
  end

  # Reproduces the reported writer failure, including a sensitive client payload.
  # @return [RSolr::Error::Http] Synthetic HTTP failure
  def solr_error
    RSolr::Error::Http.new(
      { uri: URI('http://solr.invalid/solr/test/update'), data: 'private interview text' },
      { status: 500, body: 'IndexWriter is closed', headers: { 'content-type' => 'text/plain' } }
    )
  end
end
