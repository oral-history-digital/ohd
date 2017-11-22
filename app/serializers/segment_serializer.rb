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
             :speaker_changed

  def speaker_changed
    object.transcript.strip()[0] == ":"
  end

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    object.tape.tape_number
  end

  def transcripts
    # TODO: fit this to zwar (migrate transcript and translation to a :text-attribute in segment_translations)
     {
       de: ActionView::Base.full_sanitizer.sanitize(object.read_attribute(:translation)),
       "#{object.interview.language.code[0..1]}": ActionView::Base.full_sanitizer.sanitize(object.transcript)
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
    object.annotations.map(&:text)
  end

  def references_count
    0 #object.registry_references.count
  end

  def references
    #[]
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
