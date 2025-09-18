class ApplicationJob < ActiveJob::Base

  def jobs_logger
    @@jobs_logger ||= Logger.new("#{Rails.root}/log/jobs.log")
  end

  # overrides the Delayed::Worker.max_attempts
  def max_attempts
    1
  end

  before_perform do |job|
    jobs_logger.info "job #{job_type} with file #{opts[:file_path]} started"
  end

  after_perform do |job|
    jobs_logger.info "job #{job_type} finished"

    AdminMailer.with(
      project: opts[:project],
      interview: opts[:interview],
      receiver: opts[:user],
      type: job_type,
      file: opts[:file_path],
      locale: opts[:locale],
    ).finished_job.deliver_now if opts[:user]

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_transcript.processed',
      #file: File.basename(file_path),
      #archive_id: interview.archive_id
    #)

    File.delete(opts[:file_path]) if opts[:file_path] && File.exist?(opts[:file_path])
  end

  rescue_from(StandardError) do |error|
    jobs_logger.error("*** #{opts[:interview]&.archive_id}: ")
    jobs_logger.error("#{error.message}: #{error.backtrace}")

    AdminMailer.with(
      project: opts[:project],
      interview: opts[:interview],
      receiver: opts[:user],
      type: job_type,
      file: opts[:file_path],
      locale: opts[:locale],
      error: error
    ).finished_job.deliver_now if opts[:user]
  end

  private
  
  def opts
    @opts ||= arguments.first
  end

  def job_type
    self.class.name.underscore.chomp('_job').chomp('_file')
  end
end
