class LastHeadingSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :last_heading,
             :start_time

  belongs_to :speaking_person, serializer: PersonSerializer

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

end
