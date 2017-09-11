class SegmentSerializer < ActiveModel::Serializer
  attributes :id, 
    :time, 
    :tape_nbr, 
    :transcripts, 
    :mainheading, 
    :subheading, 
    :annotation_texts, 
    :start_time, 
    :end_time, 
    :references

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
  end

  def transcripts
    {
      de: object.read_attribute(:translation),
      "#{object.interview.language.code}": object.transcript
    }
  end

  def annotation_texts
    object.annotations.map(&:text)
  end

  def references
    object.registry_references.map{|r| r.registry_entry.descriptor(:all)}
  end
end
