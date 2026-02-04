module LatexHelper
  def latex_multiscript(text)
    text = latex_escape(CGI.unescapeHTML(text))
    case text
    when /\p{Hebrew}/ then "\\texthebrew{#{text}}"
    when /\p{Arabic}/ then "\\textarabic{#{text}}"
    when /\p{Tamil}/  then "\\texttamil{#{text}}"
    else text
    end
    text.html_safe
  end

  def latex_multiscript_with_speaker(speaker, text, rtl)
    if speaker.present?
      if rtl
        "#{latex_multiscript(text)} :\\textit{#{speaker}}"
      else
        "\\textit{#{speaker}}: #{latex_multiscript(text)}"
      end
    else
      latex_multiscript(text)
    end
  end

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
