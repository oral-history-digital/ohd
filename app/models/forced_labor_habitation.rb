class ForcedLaborHabitation < ActiveRecord::Base

  has_many :interview_forced_labor_habitations
  has_many  :interviews,
            :through => :interview_forced_labor_habitations

end
