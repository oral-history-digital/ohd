class InterviewUpdateSerializer < InterviewSerializer
  attributes [
    :observations,
    :description,
  ]

  def translations_attributes
    object.translations.map(&:as_json)
  end

  def observations
    object.localized_hash(:observations)
  end

  def description
    object.localized_hash(:description)
  end
end

