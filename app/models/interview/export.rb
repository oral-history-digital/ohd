module Interview::Export

  def to_vtt(lang, tape_number=1)
    vtt = "WEBVTT\n"
    tapes.where(number: tape_number).first.segments.includes(:translations).each_with_index do |segment, index |
      vtt << "\n#{index + 1}\n#{segment.as_vtt_subtitles(lang)}\n"
    end
    vtt
  end

  def to_csv(locale, tape_number=1)
    CSV.generate(headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |csv|
      csv << %w(Timecode Speaker Transkript)

      tapes[tape_number.to_i - 1].segments.includes(
        :translations,
        {annotations: :translations},
        {registry_references: {registry_entry: {registry_names: :translations}}}
      ).each do |segment|
        contribution = contributions.where(person_id: segment.speaker_id).first
        speaker_designation = contribution && contribution.speaker_designation
        csv << [segment.timecode, speaker_designation || "", segment.text_translations[locale] || segment.text_translations["#{locale}-public"]]
      end
    end
  end

  def photos_csv(locale, only_public)
    CSV.generate(headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |f|
      f << ['Interview-ID', 'Bild-ID', 'Dateiname', 'Beschreibung', 'Datum', 'Ort', 'Fotograf*in/Urheber*in', 'Quelle/Lizenz', 'Format', 'Öffentlich']

      photos_to_export = only_public ? photos.where(workflow_state: 'public') : photos

      photos_to_export.each do |photo|
        f << [
          archive_id,
          photo.public_id,
          photo.photo_file_name,
          photo.caption(locale),
          photo.date(locale),
          photo.place(locale),
          photo.photographer(locale),
          photo.license(locale),
          photo.photo_content_type,
          photo.workflow_state == 'public' ? 'ja' : 'nein'
        ]
      end
    end
  end

  def to_pdf(header_locale, content_locale)
    header_locale = project.available_locales.include?(content_locale) ? content_locale : header_locale
    first_segment_with_heading = segments.with_heading.first
    ApplicationController.new.render_to_string(
      template: '/latex/interview_transcript.pdf.erb',
      layout: 'latex.pdf.erbtex',
      locals: {
        interview: self,
        doc_type: 'transcript',
        header_locale: header_locale,
        content_locale: content_locale,
        content_locale_public: "#{content_locale}-public",
        content_locale_human: I18n.t(content_locale, locale: header_locale),
        headings_in_content_locale: !!first_segment_with_heading &&
          (first_segment_with_heading.mainheading(content_locale) || first_segment_with_heading.subheading(content_locale))
      }
    )
  end

  def biography_pdf(header_locale, content_locale)
    header_locale = project.available_locales.include?(content_locale) ? content_locale : header_locale
    ApplicationController.new.render_to_string(
      template: '/latex/biographical_entries.pdf.erb',
      layout: 'latex.pdf.erbtex',
      locals: {
        interview: self,
        doc_type: 'biographical_entries',
        biography: true,
        header_locale: header_locale,
        content_locale: content_locale,
      }
    )
  end

  def observations_pdf(header_locale, content_locale)
    header_locale = project.available_locales.include?(content_locale) ? content_locale : header_locale
    ApplicationController.new.render_to_string(
      template: '/latex/interview_observations.pdf.erb',
      layout: 'latex.pdf.erbtex',
      locals: {
        interview: self,
        doc_type: 'observations',
        header_locale: header_locale,
        content_locale: content_locale,
      }
    )
  end

  def metadata_xml(locale)
    ApplicationController.new.render_to_string(
      template: 'interviews/metadata.xml',
      locals: {
        interview: self,
        locale: locale,
      }
    )
  end

end