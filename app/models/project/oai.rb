module Project::Oai

  def sets
    [ OAI::Set.new({name: 'Interview-Archive', spec: "archives"}) ]
  end

  def oai_locales
    available_locales
  end

  def oai_identifier
    #"oai:#{shortname}"
    "oai:oral-history.digital:#{shortname}"
  end

  def oai_dc_identifier
    oai_identifier
  end

  def oai_catalog_identifier(locale)
    "https://portal.oral-history.digital/#{locale}/catalog/archives/90408823"
  end

  def oai_url_identifier(locale)
    "#{domain_with_optional_identifier}/#{locale}"
  end

  def oai_title(locale)
    name(locale)
  end

  def oai_contributor(locale)
    institutions_with_ancestors_names(locale)
  end

  def oai_creator(locale)
    root_institutions_names(locale)
  end

  def oai_publisher(locale)
    root_institutions_names(locale)
  end

  def oai_publication_date
    publication_date
  end

  def oai_type
    "audio/video"
  end

  def type
    'Project'
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
    introduction(locale) ? ActionView::Base.full_sanitizer.sanitize(introduction(locale)) : ''
  end
  def oai_media_files_description(locale)
    TranslationValue.for('media_files', locale)
  end
  def oai_transcript_description(locale)
    TranslationValue.for('transcript', locale)
  end
end
