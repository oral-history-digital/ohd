class InterviewLanguage < ApplicationRecord
  include RefreshesSearchIndex

  belongs_to :interview, touch: true
  belongs_to :language

  refresh_search_index_on :interview_id, :language_id, :spec

  # Refreshes language fields for both ends of an interview reassignment.
  #
  # @return [Hash{String => Array<Integer>}] Affected interview documents
  def search_index_targets
    { 'Interview' => search_index_interview_ids }
  end

end
