class SegmentSerializer < ActiveModel::Serializer
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
             :references,
             :media_id

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
  end

  def transcripts
    {
      de: ActionView::Base.full_sanitizer.sanitize(object.read_attribute(:translation)),
      "#{object.interview.language.code}": ActionView::Base.full_sanitizer.sanitize(object.transcript)
    }
  end

  def annotation_texts
    object.annotations.map(&:text)
  end

  def references
    []
    #object.registry_references.select{|rr| rr.registry_entry}.map do |ref|
      #{
        #desc: ref.registry_entry.descriptor(:all),
        #latitude: ref.registry_entry.latitude.blank? ? nil : ref.registry_entry.latitude.to_f,
        #longitude: ref.registry_entry.longitude.blank? ? nil : ref.registry_entry.longitude.to_f
      #}
    #end
  end
end
