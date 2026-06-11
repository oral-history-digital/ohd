module LatexHelper
  def latex_escape(text)
    LatexToPdf.escape_latex(text).html_safe
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

  # Keep PDF date rendering in sync with app/javascript/modules/data/utils/toDateString.js.
  def interview_date_for_pdf(interview_date, locale: nil)
    value = interview_date.to_s.strip
    return '' if value.blank?

    parsed = parse_interview_date_for_pdf(value)
    return parsed unless parsed.is_a?(Date)

    if date_locale_for_pdf(locale) == 'en-US'
      "#{parsed.month}/#{parsed.day}/#{parsed.year}"
    else
      "#{parsed.day}.#{parsed.month}.#{parsed.year}"
    end
  end

  def parse_interview_date_for_pdf(value)
    patterns = [
      [/^(\d{4})-(\d{1,2})-(\d{1,2})$/, %i[year month day]],
      [/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, %i[day month year]],
      [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, %i[month day year]],
    ]

    patterns.each do |regex, order|
      match = value.match(regex)
      next unless match

      parts = order.each_with_index.to_h { |key, index| [key, match[index + 1].to_i] }
      date = Date.new(parts[:year], parts[:month], parts[:day])

      if date.year == parts[:year] && date.month == parts[:month] && date.day == parts[:day]
        return date
      end

      return value
    rescue ArgumentError
      return value
    end

    value
  end

  def date_locale_for_pdf(locale)
    locale.to_s == 'en' ? 'en-US' : locale.to_s
  end

  def latex_ltr_text(text)
    "\\textenglish{#{latex_escape(text)}}"
  end

  # Wrap text in script-aware LaTeX commands so RTL/Indic glyph shaping works.
  def latex_multiscript(text)
    return '' if text.nil?

    # Unescape HTML entities to avoid issues with LaTeX escaping.
    value = CGI.unescapeHTML(text.to_s)
    
    # Split into runs of Arabic, Hebrew, Tamil, or other text to apply appropriate LaTeX commands.
    runs = value.scan(/\p{Arabic}+|\p{Hebrew}+|\p{Tamil}+|[^\p{Arabic}\p{Hebrew}\p{Tamil}]+/u)

    runs.map do |run|
      escaped = latex_escape(run)

      if run.match?(/\p{Arabic}/)
        "\\textarabic{#{escaped}}"
      elsif run.match?(/\p{Hebrew}/)
        "\\texthebrew{#{escaped}}"
      elsif run.match?(/\p{Tamil}/)
        "\\texttamil{#{escaped}}"
      else
        escaped
      end
    end.join.html_safe
  end

  def latex_metadata_line(label, value)
    return if value.blank?

    "\\par{#{latex_multiscript("#{label}:")} #{latex_multiscript(value)}}".html_safe
  end

  # Footer segment for interview reference.
  # Keep archive id and date in an LTR run so numbers/order stay stable in RTL locales.
  def latex_footer_interview_reference(interview:, header_locale:)
    label = latex_multiscript(TranslationValue.for('interview', header_locale))
    ref = latex_ltr_text(
      "#{interview.archive_id}, #{interview_date_for_pdf(interview.interview_date, locale: header_locale)}",
    )

    "#{label} #{ref}".html_safe
  end

  # Generate the full footer line by joining the citation parts with commas and ending with a period.
  def latex_footer_line(interview:, project:, header_locale:, doc_type:)
    "#{latex_footer_citation_parts(
      interview: interview,
      project: project,
      header_locale: header_locale,
      doc_type: doc_type,
    ).join(', ')}.".html_safe
  end

  # Generate the citation fragments used in the PDF footer.
  def latex_footer_citation_parts(interview:, project:, header_locale:, doc_type:)
    parts = []

    if interview
      parts << latex_footer_intro(
        interview: interview,
        header_locale: header_locale,
        doc_type: doc_type,
      )

      if interview.interview_date
        parts << latex_footer_interview_reference(
          interview: interview,
          header_locale: header_locale,
        )
      end
    end

    parts << latex_multiscript(project.name(header_locale))

    if deutsche_seelen_collection?(interview)
      parts << latex_multiscript('Teilsammlung "Deutsche Seelen"')
    end

    if interview
      parts << latex_multiscript(
        "#{project.domain_with_optional_identifier}/#{header_locale}/interviews/#{interview.archive_id}",
      )
    end

    parts << latex_multiscript("(#{pdf_access_date})")

    if interview&.doi_status == 'created' && interview.used_doi_prefix.present?
      parts << latex_doi_reference(
        interview: interview,
        project: project,
        header_locale: header_locale,
      )
    end

    parts
  end

  def latex_footer_intro(interview:, header_locale:, doc_type:)
    interviewee_name = interview.anonymous_title(header_locale.to_sym)

    latex_multiscript(
      "#{TranslationValue.for("#{doc_type}_footer", header_locale)} #{interviewee_name}",
    )
  end

  def latex_doi_reference(interview:, project:, header_locale:)
    latex_multiscript(
      "DOI: https://doi.org/#{interview.used_doi_prefix}/#{project.shortname}.#{interview.archive_id}, " \
      "(#{TranslationValue.for('called', header_locale)}: #{pdf_access_date})",
    )
  end

  # TODO: Find a better way for this special case
  def deutsche_seelen_collection?(interview)
    interview&.collection&.name =~ /Deutsche Seelen/
  end

  def pdf_access_date
    Date.current.strftime('%d.%m.%Y')
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

    [speaker_id, rtl_speaker, ltr_speaker]
  end
end