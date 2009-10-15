class Interview < ActiveRecord::Base

  belongs_to :collection
  belongs_to :language
  has_many :interview_forced_labor_groups
  has_many  :forced_labor_groups,
            :through => :interview_forced_labor_groups

end