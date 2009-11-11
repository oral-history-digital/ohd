class InterviewForcedLaborGroup < ActiveRecord::Base

  belongs_to :interview
  belongs_to :forced_labor_group

  validates_uniqueness_of :interview_id, :scope => :forced_labor_group_id

end
