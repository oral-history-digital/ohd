class SegmentSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :transcripts,
             :mainheading,
             :subheading,
             :annotations,
             :user_annotation_ids,
             :start_time,
             :end_time,
             :references_count,
             :registry_references,
             #:references,
             :media_id,
             :timecode,
             :speaker_changed,
             :speaker_id
             #:speaker_is_interviewee

  belongs_to :speaking_person, serializer: LightPersonSerializer

  def speaker_changed
   object.speaker_changed
  end

  #def speaker_is_interviewee
    #object.speaker_id == object.interview.interviewees.first.id
  #end

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    object.tape.number
  end

  def annotations
    object.annotations.inject({}){|mem, c| mem[c.id] = AnnotationSerializer.new(c); mem}
  end

  def references_count
    object.registry_references.count
  end

  def registry_references
    object.registry_references.inject({}){|mem, c| mem[c.id] = RegistryReferenceSerializer.new(c); mem}
  end

  def mainheading
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.mainheading(projectified(locale))
      mem
    end
  end

  def subheading
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.subheading(projectified(locale))
      mem
    end
  end

end
