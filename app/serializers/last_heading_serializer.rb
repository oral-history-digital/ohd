class LastHeadingSerializer < ApplicationSerializer

  attributes :id,
             :interview_id,
             :time,
             :tape_number,
             :last_heading

  #belongs_to :speaking_person, serializer: PersonSerializer

  def time
    # timecode as seconds 
    object.respond_to?(:timecode) ? Timecode.new(object.timecode).time : nil
  end

  def interview_id
    object.respond_to?(:interview_id) ? object.interview_id : nil
  end

  def last_heading
    object.respond_to?(:last_heading) ? object.last_heading : nil
  end

  def tape_number
    if object.respond_to?(:tape_number)
      object.tape_number || object.tape.number
    end
  end

end
