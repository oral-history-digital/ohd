class SegmentSerializer < ActiveModel::Serializer
  attributes :id, :time, :tape, :transcripts#, :translation

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape
    object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
  end

  def transcripts
    {
      de: object.read_attribute(:translation),
      "#{object.interview.language.code}": object.transcript
    }
  end

end
