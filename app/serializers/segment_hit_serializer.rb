class SegmentHitSerializer < ActiveModel::Serializer

  attributes :id,
             :interview_id,
             :time,
             :start_time,
             :end_time,
             :tape_nbr,
             :transcripts,
             :timecode,
             :speaker_id

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    object.tape.number
  end

  def transcripts
    {}
  end

end
