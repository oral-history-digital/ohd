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
    :tasks_user_account_ids,
    :tasks_supervisor_ids,
  ]

  def translations
    if object.respond_to? :translations
      attribute_names = object.translated_attribute_names + [:id, :locale]
      object.translations.inject([]) do |mem, translation|
        translation_with_selected_fields = translation.attributes.select do |k, v|
          attribute_names.include?(k.to_sym)
        end
        mem.push(translation_with_selected_fields)
        mem
      end
    else
      []
    end
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
