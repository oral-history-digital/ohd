module LatexHelper

  def latex_speaker(segment, speaker_id, rtl, header_locale)
    if speaker_id != segment.speaker_id && segment.speaking_person.present?
      speaker_id = segment.speaker_id
      speaker = segment.speaking_person.name[header_locale.to_sym]
    else
      speaker = nil
    end

    if speaker.nil?
      rtl_speaker = ''
      ltr_speaker = ''
    else
      rtl_speaker = rtl ? " :#{speaker}" : ''
      ltr_speaker = rtl ? '' : "#{speaker}: "
    end

    return speaker_id, rtl_speaker, ltr_speaker
  end

end
