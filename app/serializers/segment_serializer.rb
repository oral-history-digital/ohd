class SegmentSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :transcripts,
             :mainheading,
             :subheading,
             :annotation_texts,
             :start_time,
             :end_time,
             :references_count,
             :references,
             :media_id,
             :timecode,
             :speaker_changed,
             :speaker_id
             #:speaker_is_interviewee

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

  def transcripts
    # TODO: fit this to zwar (migrate transcript and translation to a :text-attribute in segment_translations)
    s_transcript = object.transcript
    s_translation =   object.translation
    transcript = s_transcript[0] == ":" ? s_transcript.sub(/^\:+\s*\:*/,"").strip() :  s_transcript
    translation = s_translation[0] == ":" ? s_translation.sub(/^\:+\s*\:*/,"").strip() :  s_translation
     {
       de:translation,
       "#{object.interview.language.code[0..1]}": transcript
     }
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

  def annotation_texts
    object.annotations.map(&:localized_hash)
  end

  def references_count
    object.registry_references.count
  end

  def references
    object.registry_references.select{|rr| rr.registry_entry}.map do |ref|
      {
        desc: ref.registry_entry.localized_hash,
        #desc: ref.registry_entry.descriptor(:all),
        latitude: ref.registry_entry.latitude.blank? ? nil : ref.registry_entry.latitude.to_f,
        longitude: ref.registry_entry.longitude.blank? ? nil : ref.registry_entry.longitude.to_f
      }
    end
  end
end
