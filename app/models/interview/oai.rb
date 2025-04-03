module Interview::Oai

  def sets
    oai_sets = [ OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{project.shortname}"}) ]
    unless collection.nil?
      oai_sets << OAI::Set.new({name: 'Interview-Sammlung', spec: "collection:#{collection&.shortname}"})
    end
    oai_sets
  end

  def oai_locales
    %w(de en)
  end

  def oai_doi_identifier
    "#{Rails.configuration.datacite['prefix']}/#{project.shortname}.#{archive_id}"
  end

  def oai_url_identifier
    "#{project.domain_with_optional_identifier}/#{project.default_locale}/interviews/#{archive_id}"
  end

  def oai_title(locale)
    TranslationValue.for(
      'oai.xml_title',
      locale,
      interviewee: anonymous_title(locale),
      media_type: media_type,
      date: interview_date
    )
  end

  def oai_contributor
    project.institutions.map(&:name).join(", ")
  end

  def oai_date
    interview_date && Date.parse(interview_date).strftime("%d.%m.%Y") rescue interview_date
  end

  def oai_type
    media_type
  end

  def oai_format
    media_type == 'audio' ? 'audio/mp3' : 'video/mp4'
  end

  def oai_size
    duration ? Time.at(duration).utc.strftime("%H h %M min") : nil
  end

  def oai_language
    language&.code
  end

  def oai_subject_registry_entry_ids
    project.registry_reference_type_metadata_fields.inject([]) do |registry_entry_ids, field|
      registry_entry_ids << case field.ref_object_type
      when "Person"
        interviewee.registry_references
      when "Interview"
        registry_references
      when "Segment"
        segment_registry_references
      end.where(registry_reference_type_id: field.registry_reference_type_id).
      map(&:registry_entry_id).uniq
    end
  end

end
