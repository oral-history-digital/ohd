class Contribution < ApplicationRecord
  include RefreshesSearchIndex

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview, touch: true
  belongs_to :person,
    -> { includes(:translations) }
  belongs_to :contribution_type

  validates_associated :interview, :person
  validates_presence_of :contribution_type_id
  validates_uniqueness_of :person_id, :scope => [ :interview_id, :contribution_type_id ]

  scope :without_interviewees, -> { where.not(
    contribution_type_id: ContributionType.where(code: ['interviewee', 'further_interviewee']).pluck(:id)
  ) }

  scope :shared, -> { where(workflow_state: 'public') }

  refresh_search_index_on :interview_id, :person_id, :contribution_type_id, :workflow_state

  # Refreshes names, contribution text and archive assignments on both sides.
  #
  # @return [Hash{String => Array<Integer>}] Person and interview documents
  def search_index_targets
    { 'Interview' => search_index_interview_ids,
      'Person' => ([person_id] + Array(saved_change_to_person_id)).compact.uniq }
  end

end
