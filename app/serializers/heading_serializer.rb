class HeadingSerializer < ApplicationSerializer

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :mainheading,
             :subheading,
             :last_heading,
             :media_id,
             :timecode

  #belongs_to :speaking_person, serializer: PersonSerializer

  def time
    # timecode as seconds 
    Timecode.new(object.timecode).time
  end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    object.tape.number
  end

  %w(mainheading subheading).each do |m|
    define_method m do
      object.translations.inject({}) do |mem, t|
        mem[t.locale] = t.send(m) || ''
        mem
      end
    end
  end

end
