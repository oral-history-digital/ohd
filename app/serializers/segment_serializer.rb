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
             :annotations,
             :user_annotation_ids,
             :references_count,
             :registry_references,
             :annotations_count,
             #:references,
             :media_id,
             :timecode,
             :speaker_changed,
             :speaker_id,
             :speaker
             #:speaker_is_interviewee

  def speaker_changed
   object.speaker_changed
  end

  #def speaker_is_interviewee
    #object.speaker_id == object.interview.interviewees.first.id
  #end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    object.tape_number || object.tape.number
  end

  def tape_count
    object.interview.tapes.count
  end

  def annotations
    object.annotations.inject({}){|mem, c| mem[c.id] = ::AnnotationSerializer.new(c); mem}
  end

  def annotations_count
    if object.annotations.count > 0
      (object.project.available_locales + [object.interview.lang]).inject({}) do |mem, locale|
        mem[locale] = object.annotations.includes(:translations).where("annotation_translations.locale": locale).count
        mem
      end
    else
      zero_counts(object)
    end
  end

  def references_count
    if object.registry_references.count > 0
      (object.project.available_locales + [object.interview.lang]).inject({}) do |mem, locale|
        mem[locale] = object.registry_references.where("registry_name_translations.locale": locale).count
        mem
      end
    else
      zero_counts(object)
    end
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

  def text
    object.transcripts
  end

  private

  def zero_counts(object)
    object.available_locales.map{ |locale| [locale, 0] }.to_h
  end

end
