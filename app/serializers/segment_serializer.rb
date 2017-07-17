class SegmentSerializer < ActiveModel::Serializer
  attributes :id, :time, :tape, :transcript, :translation

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape
    object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
  end

end
