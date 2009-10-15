class ForcedLaborGroup < ActiveRecord::Base

  has_many :interview_forced_labor_groups
  has_many  :interviews,
            :through => :interview_forced_labor_groups

end
