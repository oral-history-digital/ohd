module LatexHelper

  def latex_escape(text)
    LatexToPdf.escape_latex(text)
  end

  def interview_metadata_label_for_pdf(interview, attribute, locale)
    metadata_field = interview
      &.project
      &.metadata_fields
      &.find_by(source: 'Interview', name: attribute.to_s)
    custom_label = metadata_field&.label(locale)

    if custom_label.present?
      custom_label
    else
      TranslationValue.for("activerecord.attributes.interview.#{attribute}", locale)
    end
  end

  def interview_date_for_pdf(interview_date, separator: ', ')
    value = interview_date.to_s.strip
    return value if value.blank?

    # Only normalize when the entire string is made of supported date tokens
    # and separators; otherwise keep original text as entered.
    tokenized = value.dup
    dates = []

    # Collect YYYY-MM-DD dates not adjacent to digits, removing them from the tokenized text.
    tokenized.gsub!(/(?<!\d)(\d{4})-(\d{1,2})-(\d{1,2})(?!\d)/) do
      dates << Date.new(Regexp.last_match(1).to_i, Regexp.last_match(2).to_i, Regexp.last_match(3).to_i)
      ''
    rescue ArgumentError
      return value
    end

    # Collect DD.MM.YYYY dates not adjacent to digits, removing them from the tokenized text.
    tokenized.gsub!(/(?<!\d)(\d{1,2})\.(\d{1,2})\.(\d{4})(?!\d)/) do
      dates << Date.new(Regexp.last_match(3).to_i, Regexp.last_match(2).to_i, Regexp.last_match(1).to_i)
      ''
    rescue ArgumentError
      return value
    end

    remaining = tokenized.gsub(/\s+/, '') # Remove whitespace for separator check
    separators_only = remaining.gsub(/,|;|\//, '').empty? # Check if only supported separators remain

    # If there are valid dates and the remaining text only contains separators,
    # format the dates; otherwise return original value.
    return value unless dates.any? && separators_only

    # Normalize only clean date lists, preserving free-form text unchanged.
    dates.map { |d| d.strftime('%d.%m.%Y') }.join(separator)
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
