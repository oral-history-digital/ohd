class Interview < ActiveRecord::Base

  belongs_to :collection
  belongs_to :language

  has_many :interview_forced_labor_groups
  has_many  :forced_labor_groups,
            :through => :interview_forced_labor_groups

  has_many :interview_forced_labor_habitations
  has_many  :forced_labor_habitations,
            :through => :interview_forced_labor_habitations
          
  has_many :interview_forced_labor_fields
  has_many  :forced_labor_fields,
            :through => :interview_forced_labor_fields

  validates_associated :collection
  validates_presence_of :full_title, :archive_id
  validates_uniqueness_of :archive_id

end