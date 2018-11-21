class SegmentHitSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :text,
             :timecode,
             :speaker_id,
             :last_heading

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    object.tape.number
  end

  def text
    {}
  end

end
