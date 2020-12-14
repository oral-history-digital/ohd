class SegmentSerializer < ApplicationSerializer

  attributes :id,
             :interview_id,
             :archive_id,
             :sort_key,
             :time,
             :tape_nbr,
             :tape_count,
             :text,
             :mainheading,
             :subheading,
             :has_heading,
             :annotations,
             :annotations_count,
             :annotations_total_count,
             :user_annotation_ids,
             :registry_references,
             :references_count,
             :references_total_count,
             #:references,
             :media_id,
             :timecode,
             :speaker_changed,
             :speaker_id,
             :speaker
             #:speaker_is_interviewee


  def text
    object.transcripts
  end

  def annotations
    object.annotations.inject({}){|mem, c| mem[c.id] = ::AnnotationSerializer.new(c); mem}
  end

  def registry_references
    object.registry_references.inject({}){|mem, c| mem[c.id] = ::RegistryReferenceSerializer.new(c); mem}
  end

  def mainheading
    object.translations.inject({}) do |mem, translation|
      mem[translation.locale] = translation.mainheading
      mem
    end
  end

  def subheading
    object.translations.inject({}) do |mem, translation|
      mem[translation.locale] = translation.subheading
      mem
    end
  end

end
