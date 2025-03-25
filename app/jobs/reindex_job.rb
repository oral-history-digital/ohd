class ReindexJob < ApplicationJob
  queue_as :default

  def perform(archive_ids)
    Interview.where(archive_id: archive_ids) 
    Sunspot.index! objs
  end

end
