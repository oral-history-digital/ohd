class AssignSpeakersJob < ApplicationJob
  queue_as :default

  def perform(interview, speakers, contribution_data, receiver)
    if !contribution_data && speakers.length > 0
      interview.segments.each do |segment|
        segment.update_attribute :speaker_id, speakers[segment.speaker] if segment.speaker && speakers[segment.speaker]
      end
    else
      contribution_data.each do |c|
        speaker_designation = c.delete(:speaker_designation)
        contribution = Contribution.find_or_create_by c
        contribution.update speaker_designation: speaker_designation
      end

      interview.segments.each do |segment|
        next_timecode = segment.next && segment.next.timecode
        segment.translations.each do|translation|
          opts = {
            text: translation.text,
            locale: translation.locale,
            interview_id: segment.interview_id,
            tape_id: segment.tape_id,
            timecode: segment.timecode,
            next_timecode: next_timecode
          }
          Segment.assign_speakers_and_update_text(segment, opts) if translation.text
        end
      end
    end
  end

end
