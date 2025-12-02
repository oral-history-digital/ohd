class SegmentSerializer < ApplicationSerializer

  attributes :id,
             :interview_id,
             :sort_key,
             :time,
             :tape_nbr,
             :text,
             :mainheading,
             :subheading,
             :has_heading,
             :annotations,
             :annotations_count,
             :user_annotation_ids,
             :registry_references,
             :registry_references_count,
             :media_id,
             :timecode,
             :transcript_coupled,
             :speaker_id,
             :speaker
             #:speaker_is_interviewee

  def translations_attributes
    if instance_options[:allowed_to_see_all]
      object.translations.map(&:as_json)
    else
      []
    end
  end

  def text
    object.transcripts(instance_options[:allowed_to_see_all])
  end

  def annotations
    # Use to_a to ensure preloaded associations are used
    object.annotations.to_a.inject({}){|mem, c| mem[c.id] = ::AnnotationSerializer.new(c); mem}
  end

  def registry_references
    # Use to_a to ensure preloaded associations are used
    object.registry_references.to_a.inject({}){|mem, c| mem[c.id] = ::RegistryReferenceSerializer.new(c); mem}
  end

  def mainheading
    # Use to_a to ensure preloaded translations are used (avoid N+1)
    object.translations.to_a.inject({}) do |mem, translation|
      mem[translation.locale] = translation.mainheading
      mem
    end
  end

  def subheading
    # Use to_a to ensure preloaded translations are used (avoid N+1)
    object.translations.to_a.inject({}) do |mem, translation|
      mem[translation.locale] = translation.subheading
      mem
    end
  end

  def transcript_coupled
    instance_options[:transcript_coupled]
  end
end
