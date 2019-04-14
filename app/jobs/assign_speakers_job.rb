class AssignSpeakersJob < ApplicationJob
  include IsoHelpers
  queue_as :default

  def perform(interview, speakers)
    interview.segments.each do |segment|
      next_timecode = segment.next && segment.next.timecode
      segment.translations.each do|translation|
        opts = {
          text: translation.text,
          locale: translation.locale,
          interview_id: segment.interview_id,
          tape_id: segment.tape_id,
          timecode: segment.timecode,
          next_timecode: next_timecode,
          contribution_data: speakers
        }
        Segment.assign_speakers_and_update_text(segment, opts)
      end
    end
  end

end
