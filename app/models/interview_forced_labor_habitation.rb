class InterviewForcedLaborHabitation < ActiveRecord::Base

  belongs_to :interview
  belongs_to :forced_labor_habitation

  validates_uniqueness_of :interview_id, :scope => :forced_labor_habitation_id

end
