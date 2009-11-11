class InterviewForcedLaborField < ActiveRecord::Base

  belongs_to :interview
  belongs_to :forced_labor_field

  validates_uniqueness_of :interview_id, :scope => :forced_labor_field_id

end
