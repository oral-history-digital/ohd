module Project::Oai

  def sets
    [ OAI::Set.new({name: 'Interview-Archive', spec: "archives"}) ]
  end

  def oai_locales
    %w(de en)
  end

  def oai_identifier
    #"oai:#{shortname}"
    "oai:oral-history.digital:#{shortname}"
  end

  def oai_dc_identifier
    oai_identifier
  end

  def oai_url_identifier(locale)
    "#{domain_with_optional_identifier}/#{locale}"
  end

  def oai_title(locale)
    name(locale)
  end

  def oai_contributor(locale)
    institutions.map{|i| i.name(locale)}.join(", ")
  end

  def oai_creator(locale)
    institutions.where.not(parent_id: nil).first&.name(locale) ||
      institutions.first&.name(locale)
  end

  def oai_publisher(locale)
    institutions.where(parent_id: nil).first&.name(locale) ||
      institutions.first&.name(locale)
  end

  def oai_publication_date
    publication_date #created_at.strftime("%d.%m.%Y")
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
    subjects_registry_entry = RegistryEntry.find 21898673
    RegistryReference.where(
      registry_entry_id: subjects_registry_entry.children.pluck(:id),
      ref_object_id: interviews.pluck(:id),
      ref_object_type: "Interview",
    ).pluck(:registry_entry_id).uniq
  end

  def oai_abstract_description(locale)
    ActionView::Base.full_sanitizer.sanitize(introduction(locale))
  end
  def oai_media_files_description(locale)
    TranslationValue.for('media_files', locale)
  end
  def oai_transcript_description(locale)
    TranslationValue.for('transcript', locale)
  end
end
