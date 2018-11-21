class AssignSpeakersJob < ApplicationJob
  include IsoHelpers
  queue_as :default

  def perform(interview, speakers)
    orig_lang = projectified(interview.language.code)

    initials = []
    interview.segments.each do |segment|
      initials = segment.initials(orig_lang) unless segment.initials(orig_lang).blank?
      if initials.length > 1
        start_time = segment.time
        end_time = segment.next && segment.next.time
        duration = end_time ? end_time - start_time : 7.seconds
        orig_text_length = segment.text(orig_lang).length
        duration_per_char = duration / orig_text_length

        splitted_texts_with_locales = {}
        segment.translations.each do |translation|
          splitted_texts_with_locales[translation.locale] = translation.text.split(/\*\w+:\*/).select{|s| !s.blank?}
        end

        orig_splitted_texts = splitted_texts_with_locales[orig_lang]
        orig_splitted_texts.each_with_index do |text, index|
          if index == 0
            segment.update_attribute :speaker_id, speakers[initials[0]]
          else
            segment = Segment.create interview_id: interview.id, speaker_id: speakers[initials[index]], start_time: start_time
          end
          update_texts(segment, splitted_texts_with_locales, index)
          start_time += text.length * duration_per_char
        end
      else
        segment.update_attribute :speaker_id, speakers[initials.last] 
        segment.translations.each do |translation| 
          translation.update_attribute :text, translation.text.gsub(/\*\w+:\*/, '')
        end
      end
    end
  end

  def update_texts(segment, splitted_texts_with_locales, index)
    splitted_texts_with_locales.each do |locale, texts|
      I18n.locale = locale
      segment.update_attribute :text, texts[index]
    end
  end
end
