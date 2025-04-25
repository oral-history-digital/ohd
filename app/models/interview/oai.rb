module Interview::Oai

  def sets
    oai_sets = [ OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{project.shortname}"}) ]
    unless collection.nil?
      oai_sets << OAI::Set.new({name: 'Interview-Sammlung', spec: "collection:#{collection_id}"})
      #oai_sets << OAI::Set.new({name: 'Interview-Sammlung', spec: "collection:#{collection&.shortname}"})
    end
    oai_sets
  end

  def oai_locales
    project.available_locales
  end

  def oai_identifier
    "oai:#{project.shortname}:#{archive_id}"
    #project.domain_with_optional_identifier + "/#{project.default_locale}/interviews/#{archive_id}"
  end

  def oai_dc_identifier
    oai_identifier
  end

  def oai_doi_identifier
    "#{Rails.configuration.datacite['prefix']}/#{project.shortname}.#{archive_id}"
  end

  def oai_url_identifier(locale)
    "#{project.domain_with_optional_identifier}/#{locale}/interviews/#{archive_id}"
    #"#{project.domain_with_optional_identifier}/#{project.default_locale}/interviews/#{archive_id}"
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

  def oai_contributor(locale)
    project.institutions_with_ancestors_names(locale)
  end

  def oai_publisher(locale)
    project.root_institutions_names(locale)
  end

  def oai_date
    interview_date && Date.parse(interview_date).strftime("%Y-%m-%d") rescue interview_date
  end

  def oai_publication_date
    publication_date || project.publication_date
  end

  def oai_type
    media_type
  end

  def type
    'Interview'
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
    subjects_registry_entry = RegistryEntry.find 21898673
    registry_references.where(registry_entry_id: subjects_registry_entry.children.pluck(:id)).
      pluck(:registry_entry_id).uniq
  end

end
