class ReindexJob < ApplicationJob
  queue_as :default

  def perform(conditions = {})
    Sunspot.index! Interview.where(conditions) 
  end

end
