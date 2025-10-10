class InterviewUpdateSerializer < InterviewSerializer
  attributes [
    :properties,
    :observations,
    :links,
    :pseudo_links,
    :contributors,
  ]

  def translations_attributes
    object.translations.map(&:as_json)
  end

  def observations
    object.localized_hash(:observations)
  end

  def contributors
    object.contributors.inject({}) { |mem, c| mem[c.id] = PersonSerializer.new(c); mem }
  end
end

