class ForcedLaborField < ActiveRecord::Base

  has_many :interview_forced_labor_fields
  has_many  :interviews,
            :through => :interview_forced_labor_fields

end
