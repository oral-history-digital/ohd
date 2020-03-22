class ApplicationJob < ActiveJob::Base

  def clear_cache(ref_object)
    Rails.cache.delete "#{Project.current.cache_key_prefix}-#{ref_object.class.name.underscore}-#{ref_object.identifier}-#{ref_object.updated_at}"
  end

  def jobs_logger
    @@jobs_logger ||= Logger.new("#{Rails.root}/log/jobs.log")
  end

end
