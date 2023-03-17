class ApplicationJob < ActiveJob::Base

  def jobs_logger
    @@jobs_logger ||= Logger.new("#{Rails.root}/log/jobs.log")
  end

  # overrides the Delayed::Worker.max_attempts
  def max_attempts
    1
  end
end
