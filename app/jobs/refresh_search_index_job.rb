# Updates Solr documents for affected database records and removes deleted records.
# Collects IDs during database writes, then schedules indexing after commit.
# Inherits directly from ActiveJob because ApplicationJob adds file cleanup and mail.
class RefreshSearchIndexJob < ActiveJob::Base
  queue_as :indexing
  queue_with_priority 50

  # Reports Solr failures without including indexed content from client exceptions.
  class IndexingError < StandardError; end

  # Active Job reschedules explicitly, independently of Delayed::Worker.max_attempts.
  retry_on IndexingError, wait: :polynomially_longer, attempts: 3

  around_perform :log_indexing_attempt

  # Returns the dedicated, size-rotated log without Rails or Solr payload logging.
  #
  # @return [Logger] Indexing lifecycle logger
  def self.indexing_logger
    @indexing_logger ||= Logger.new(
      Rails.root.join('log/solr_indexing.log'), 5, 10.megabytes,
      formatter: ->(_severity, _time, _program, message) { "#{message}\n" }
    )
  end

  # Collects affected IDs and enqueues indexing after the database transaction commits.
  # Repeated calls in the same transaction share one job; rollback skips enqueueing.
  #
  # @example Schedule updates for specific database records
  #   RefreshSearchIndexJob.enqueue_after_commit('Interview' => [12, 34], 'Person' => [56])
  # @param targets [Hash{String => Array<Integer>}] Model names and internal database IDs
  # @return [void]
  def self.enqueue_after_commit(targets)
    # Remove nil and duplicate IDs, then remove entries with no IDs.
    targets = targets.transform_values { |ids| ids.compact.uniq }.reject { |_, ids| ids.empty? }
    return if targets.empty?

    transaction = ActiveRecord::Base.current_transaction
    if (batch = ActiveSupport::IsolatedExecutionState[:search_index_batch])
      # An explicit .batch block owns scheduling. Add these IDs only after commit
      # so a rolled-back transaction contributes no work to that batch.
      transaction.after_commit do
        targets.each { |model, ids| batch[model] = Array(batch[model]) | ids }
      end
      return
    end
    if transaction.closed?
      # No database transaction is open, so there is no commit to wait for.
      perform_later(targets)
      return
    end

    # Store the shared ID collection on this transaction object. Later calls in
    # the same transaction reuse it instead of registering another job.
    pending = transaction.instance_variable_get(:@search_index_targets)
    unless pending
      pending = {}
      transaction.instance_variable_set(:@search_index_targets, pending)
      # The callback reads the same hash after all calls have added their IDs.
      transaction.after_commit { perform_later(pending) }
    end
    targets.each do |model, ids|
      # Array(nil) is []; array union (|) combines IDs without duplicates.
      pending[model] = (Array(pending[model]) | ids.compact)
    end
  end

  # Combines indexing requests made inside the block into one background job.
  # Each transaction adds its IDs after commit; nested batch blocks share the
  # outer batch's collection and leave scheduling to the outer block.
  #
  # @yield Database writes to batch
  # @return [void]
  def self.batch
    # Execution-local storage lets enqueue_after_commit find the active batch
    # without passing the collection through every model callback.
    previous = ActiveSupport::IsolatedExecutionState[:search_index_batch]
    pending = previous || {}
    ActiveSupport::IsolatedExecutionState[:search_index_batch] = pending
    yield
    unless previous
      # Wait for any still-open database transactions before enqueueing.
      ActiveRecord.after_all_transactions_commit { perform_later(pending) unless pending.empty? }
    end
  ensure
    # Restore the enclosing batch (or clear this one), even if the block raises.
    ActiveSupport::IsolatedExecutionState[:search_index_batch] = previous
  end

  # Loads records from the database and updates their Solr documents in batches.
  # Removes documents whose requested records no longer exist.
  #
  # @param targets [Hash{String => Array<Integer>}] Model names and internal database
  #   IDs; Project IDs request reindexing of the project's interviews
  # @return [void]
  # @raise [KeyError] If a model name other than Project is not supported
  # @raise [IndexingError] If Solr cannot apply or commit the requested updates
  def perform(targets)
    targets.each do |name, ids|
      if name == 'Project'
        # Project facet changes affect interview documents. Umbrella projects
        # cover all interviews; other projects cover only their own interviews.
        Project.where(id: ids).find_each do |project|
          scope = project.umbrella? ? Interview.all : project.interviews
          scope.find_in_batches { |records| Sunspot.index(records) }
        end
        next
      end

      # Resolve only the explicitly supported document models.
      model = { 'Interview' => Interview, 'Person' => Person, 'Photo' => Photo,
                'Segment' => Segment, 'Annotation' => Annotation, 'Event' => Event,
                'BiographicalEntry' => BiographicalEntry, 'RegistryEntry' => RegistryEntry }.fetch(name)
      records = model.where(id: ids)
      # Requested IDs absent from the database still need their Solr documents removed.
      (ids - records.pluck(:id)).each { |id| Sunspot.remove_by_id(model, id) }
      records.find_in_batches { |batch| Sunspot.index(batch) }
    end
    # Commit the index changes to Solr; this is separate from a database commit.
    Sunspot.commit
  rescue RSolr::Error::Http, Errno::ECONNREFUSED, Errno::ECONNRESET, Timeout::Error, SocketError => e
    # RSolr exceptions can contain the full indexed document; do not log that payload.
    raise IndexingError, "Solr indexing failed (#{e.class.name})", cause: nil
  end

  private

  # Records each execution attempt, including failures handled by the retry policy.
  #
  # @yield The indexing job execution
  # @return [Object] Result of the job execution
  def log_indexing_attempt
    started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    log_indexing_event('start')
    result = yield
    log_indexing_event('success', started_at: started_at)
    result
  rescue StandardError => e
    log_indexing_event('failure', started_at: started_at, error: e)
    raise
  end

  # Logs only lifecycle metadata and numeric IDs; never model content or error messages.
  #
  # @param event [String] Execution outcome
  # @param started_at [Float, nil] Monotonic start time for elapsed duration
  # @param error [Exception, nil] Failure whose class can be logged safely
  # @return [void]
  def log_indexing_event(event, started_at: nil, error: nil)
    targets = arguments.first.is_a?(Hash) ? arguments.first : {}
    entry = {
      timestamp: Time.current.utc.iso8601(3), event: event, job_id: job_id, attempt: executions,
      targets: targets.slice(*%w[Project Interview Person Photo Segment Annotation Event BiographicalEntry RegistryEntry])
                      .transform_values do |ids|
                        Array(ids).grep(Integer)
                      end
    }
    entry[:duration_ms] = ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at) * 1000).round if started_at
    entry[:error] = error.class.name if error
    self.class.indexing_logger.public_send(error ? :error : :info, entry.to_json)
  rescue IOError, SystemCallError => e
    Rails.logger.warn("Solr indexing log unavailable (#{e.class.name})")
  end
end
