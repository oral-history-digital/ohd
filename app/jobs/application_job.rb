class ApplicationJob < ActiveJob::Base

  def jobs_logger
    @@jobs_logger ||= Logger.new("#{Rails.root}/log/jobs.log")
  end

end
