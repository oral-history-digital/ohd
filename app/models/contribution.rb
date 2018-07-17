class Contribution < ActiveRecord::Base

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview
  belongs_to :person, 
    -> { includes(:translations) }

  validates_associated :interview, :person
  validates_presence_of :contribution_type
  validates :contribution_type, inclusion: Project.contribution_types.values
  validates_uniqueness_of :person_id, :scope => [ :interview_id, :contribution_type ]

end
