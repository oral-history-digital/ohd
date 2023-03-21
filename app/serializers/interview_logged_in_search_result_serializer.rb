class InterviewLoggedInSearchResultSerializer < InterviewBaseSerializer
  attributes [
    :title,
    :short_title,
    :description,
    :workflow_state,
    :workflow_states,
    :doi_status,
    :properties,
    :signature_original,
    :task_ids,
    :tasks_user_ids,
    :tasks_supervisor_ids,
  ]

  def translations
    object.translations.map(&:as_json)
  end

  def title
    object.localized_hash(:title)
  end

  def short_title
    object.localized_hash(:reverted_short_title)
  end

  def description
    object.localized_hash(:description)
  end

end
