class InterviewLoggedInSearchResultSerializer < InterviewBaseSerializer
  attributes [
    :title,
    :short_title,
    :description,
    :contributions,
    :registry_references,
    :workflow_state,
    :workflow_states,
    :doi_status,
    :properties,
    :signature_original,
    :task_ids,
    :tasks_user_account_ids,
    :tasks_supervisor_ids,
  ]

  def title
    object.localized_hash(:title)
  end

  def short_title
    object.localized_hash(:reverted_short_title)
  end

  def description
    object.localized_hash(:description)
  end

  def contributions
    json =  Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-contributions-#{object.id}-#{object.contributions.maximum(:updated_at)}") do
      object.contributions.inject({}) { |mem, c| mem[c.id] = cache_single(object.project, c); mem }
    end
  end

  def registry_references
    json = Rails.cache.fetch("#{object.project.cache_key_prefix}-interview-registry_references-#{object.id}-#{object.registry_references.maximum(:updated_at)}") do
      object.registry_references.inject({}) { |mem, c| mem[c.id] = cache_single(object.project, c); mem }
    end
  end

end
