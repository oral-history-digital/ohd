class Contribution < ApplicationRecord

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview
  belongs_to :person,
    -> { includes(:translations) }
  #belongs_to :contribution_type

  validates_associated :interview, :person
  validates_presence_of :contribution_type_id
  validates_uniqueness_of :person_id, :scope => [ :interview_id, :contribution_type_id ]

  after_save :touch_interview
  after_destroy :touch_interview

  def touch_interview
    interview && interview.touch
  end
end
