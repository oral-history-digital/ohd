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
      case attribute
      when /^public_/
        hash[:properties] = object.properties
      when /duration|tape_count|description|observations/
        # already handled by super via localized_hash or custom serializer method
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

