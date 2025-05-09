module Collection::Oai

  def sets
    [
      OAI::Set.new({name: 'Interview-Sammlungen', spec: "collections"}),
      OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{project.shortname}"})
    ]
  end

  def oai_locales
    project.available_locales
  end

  def oai_identifier
    #"oai:#{shortname}"
    #"oai:#{project.shortname}:#{shortname}"
    #"oai:#{project.shortname}:collection-#{id}"
    #"oai:oral-history.digital:#{project.shortname}:collection-#{id}"
    "oai:oral-history.digital:collection-#{id}"
  end

  def oai_dc_identifier
    oai_identifier
  end

  def oai_url_identifier(locale)
    "#{project.domain_with_optional_identifier}/#{locale}/catalog/collections/#{id}"
  end

  def oai_title(locale)
    name(locale)
  end

  def oai_contributor(locale)
    project.institutions_with_ancestors_names(locale)
  end

  def oai_creator(locale)
    project.root_institutions_names(locale)
  end

  def oai_publisher(locale)
    project.root_institutions_names(locale)
  end

  def oai_publication_date
    (publication_date || project.publication_date) &&
      Date.parse(publication_date || project.publication_date).strftime("%Y-%m-%d") rescue publication_date || project.publication_date
  end

  def oai_type
    "audio/video"
  end

  def type
    'Collection'
  end

  def oai_formats
    [
      "video/mp4",
      "audio/mp3"
    ]
  end

  def oai_size
    "#{interviews.count} Interviews"
  end

  def oai_languages
    Language.where(id: interviews.map{|i| i.interview_languages.pluck(:language_id)}.flatten.uniq).pluck(:code)
  end

  def oai_subject_registry_entry_ids
    ohd_subject_registry_entry_ids
  end

  def oai_abstract_description(locale)
    notes(locale) ? ActionView::Base.full_sanitizer.sanitize(notes(locale)) : ''
  end
  def oai_media_files_description(locale)
    TranslationValue.for('media_files', locale)
  end
  def oai_transcript_description(locale)
    TranslationValue.for('transcript', locale)
  end
end
