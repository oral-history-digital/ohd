class SegmentHitSerializer < ApplicationSerializer

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :text,
             :timecode,
             :speaker_id,
             :last_heading,
             :sort_key

  def time
    # timecode as seconds 
    Timecode.new(object.timecode).time
  end

  def tape_nbr
    object.tape.number
  end

  def text
    {}
  end

end
