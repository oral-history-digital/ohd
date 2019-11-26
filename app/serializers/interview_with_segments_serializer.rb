class InterviewWithSegmentsSerializer < InterviewSerializer

  def segments
    object.tapes.inject({}) do |tapes, tape|
      segments_for_tape = tape.segments.
        includes(:translations, :registry_references, :user_annotations, annotations: [:translations], speaking_person: [:translations]).
        where.not(timecode: '00:00:00.000').order(:timecode)#.first(20)

      tapes[tape.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = JSON.parse(SegmentSerializer.new(s).to_json); mem}
      tapes
    end
  end

end
