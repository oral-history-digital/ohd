class MarkTextJob < ApplicationJob
  queue_as :default

  def perform(interview, texts_to_mark, locale, receiver)
    interview.segments.each do |segment|
      text = segment.text(locale)
      texts_to_mark.each do |t|
        regexp = Regexp.new(Regexp.quote(t))
        if text =~ regexp
          replacement = ''
          t.length.times{|i| replacement << '*'}
          text = text.gsub(regexp, replacement)
          segment.create_or_update_marked_copy(text, locale, 'with_replacement')
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
