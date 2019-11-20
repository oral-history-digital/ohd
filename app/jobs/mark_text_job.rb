class MarkTextJob < ApplicationJob
  queue_as :default

  def perform(interview, texts_to_mark, locale, receiver)
    interview.segments.each do |segment|
      text = segment.text("#{locale}-original")
      texts_to_mark.each do |t|
        regexp = Regexp.new(Regexp.quote(t['text_to_mark']))
        if text =~ regexp
          text = text.gsub(regexp, t['replacement'])
          segment.update_original_and_write_other_versions(text: text, locale: locale)
        end
      end
    end

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.mark_texts.processed',
      ##msg: interview.speaker_designations.empty? ? 'edit.update_speaker.second_step_explanation' : 'edit.update_speaker.first_step_explanation'
      #archive_id: interview.archive_id
    #)

  end

end
