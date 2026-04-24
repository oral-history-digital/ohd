class ReindexJob < ApplicationJob
  queue_as :default

  def perform(conditions = {})
    Sunspot.index! Interview.where(conditions) 
    Sunspot.index! Interview.where(conditions).segments
  end

end
