class InterviewUpdateSerializer < InterviewSerializer
  attributes [
    :properties,
    :observations,
    :links,
    :pseudo_links,
    :contributors,
  ]

  def attributes(*args)
    hash = super
    instance_options[:changes]&.each do |attribute|
      case attribute
      when /^public_/
        hash[:properties] = object.properties
      when /duration|tape_count/
        # already handled
      else
        hash[attribute] = object.send(attribute)
      end
    end
    hash
  end

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

