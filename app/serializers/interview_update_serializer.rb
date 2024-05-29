class InterviewUpdateSerializer < InterviewSerializer
  attributes [
    :observations,
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

