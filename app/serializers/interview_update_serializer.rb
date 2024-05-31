class InterviewUpdateSerializer < ApplicationSerializer
  attributes [
    :properties,
    :description,
    :observations,
  ]

  def attributes(*args)
    hash = super
    instance_options[:changes].each do |attribute|
      hash[attribute] = object.send(attribute)
    end
    hash
  end

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

