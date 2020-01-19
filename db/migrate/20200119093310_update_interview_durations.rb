class UpdateInterviewDurations < ActiveRecord::Migration[5.2]
  def up
    Interview.where(duration: [nil, 0]).each{|i| i.recalculate_duration! }
  end
  def down
  end
end
