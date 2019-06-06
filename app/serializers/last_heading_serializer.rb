class LastHeadingSerializer < ApplicationSerializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :last_heading

  belongs_to :speaking_person, serializer: PersonSerializer

  def time
    # timecode as seconds 
    object.try(:timecode) ? Time.parse(object.timecode).seconds_since_midnight : nil
  end

  def interview_id
    object.try(:interview_id) ? object.interview_id : nil
  end

  def last_heading
    object.try(:last_heading) ? object.last_heading : nil
  end

end
