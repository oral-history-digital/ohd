class UpdateInterviewDurations < ActiveRecord::Migration[5.2]
  def up
    Interview.where(duration: [nil, 0]).each do |i| 
      i.recalculate_duration! 
    rescue
      p "*** could not recalculate duration for #{i.archive_id}"
    end
  end
  def down
  end
end
