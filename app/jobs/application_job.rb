class ApplicationJob < ActiveJob::Base

  def clear_cache(ref_object)
    Rails.cache.delete "#{ref_object.class.name.underscore}-#{ref_object.identifier}-#{ref_object.updated_at}"
  end

end
