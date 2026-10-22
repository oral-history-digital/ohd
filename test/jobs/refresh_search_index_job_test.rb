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

  private

  # Reproduces the reported writer failure, including a sensitive client payload.
  # @return [RSolr::Error::Http] Synthetic HTTP failure
  def solr_error
    RSolr::Error::Http.new(
      { uri: URI('http://solr.invalid/solr/test/update'), data: 'private interview text' },
      { status: 500, body: 'IndexWriter is closed', headers: { 'content-type' => 'text/plain' } }
    )
  end
end
