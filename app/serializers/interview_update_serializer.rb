class InterviewUpdateSerializer < ApplicationSerializer
  attributes [
    :properties,
    :description,
    :observations,
    :duration,
    :tape_count,
    :links,
    :pseudo_links,
  ]

  def attributes(*args)
    hash = super
    instance_options[:changes].each do |attribute|
      unless %w(duration tape_count).include?(attribute)
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

  def description
    object.localized_hash(:description)
  end

  def tape_count
    format("%02d", object.tapes.count)
  end

  def duration
    Timecode.new(object.duration).timecode
  end

end

