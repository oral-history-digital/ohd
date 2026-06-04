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

  #def oai_url_identifier(locale)
    #"#{OHD_DOMAIN}/#{locale}/catalog/collections/#{id}"
  #end

  def oai_doi_identifier
    "https://doi.org/#{Rails.configuration.datacite['prefix']}/#{project.shortname}.collection-#{id}"
  end

  def oai_catalog_identifier(locale)
    "#{OHD_DOMAIN}/#{locale}/catalog/collections/#{id}"
  end

  def oai_title(locale)
    name(locale)
  end

  def oai_contributor(locale)
    "Oral-History.Digital / University Library of Freie Universität Berlin"
    #project.institutions_with_ancestors_names(locale)
  end

  def oai_publisher(locale)
    project.oai_publisher(locale)
  end

  def oai_publication_date
    (publication_date || project.publication_date) &&
      Date.parse(publication_date || project.publication_date).strftime("%Y-%m-%d") rescue publication_date || project.publication_date
  end

  def oai_type
    "Collection"
  end

  def oai_doi_identifier
    "https://doi.org/#{Rails.configuration.datacite['prefix']}/#{project.shortname}.#{id}"
  end

  def type
    'Collection'
  end

  def oai_formats
    formats = interviews.pluck(:media_type).uniq.map do |mt|
      case mt
      when 'video'
        "video/mp4"
      when 'audio'
        "audio/mp3"
      end
    end.compact
    if Segment.where(interview_id: interviews.pluck(:id)).exists?
      formats += [
      'transcript/pdf',
      'transcript/csv',
      'transcript/vtt',
      'transcript/tei-xml'
      ]
    end
    formats
  end

  def oai_size
    "#{interviews.count} Interviews"
  end

  def oai_coverage
    interview_year_range = CollectionMetricsRepository.new(id).interview_year_range
    min = interview_year_range[:min]
    max = interview_year_range[:max]
    if min.nil? && max.nil?
      return nil
    end
    "#{min}-#{max}"
  end

  def oai_birth_years
    birthdays = CollectionMetricsRepository.new(id).birth_year_range
    if birthdays[:min].nil? && birthdays[:max].nil?
      return nil
    end
    "#{birthdays[:min]}-#{birthdays[:max]}"
  end

  def oai_languages
    # return 'mul' if more than 1 language, otherwise the code of the single language
    if interviews.joins(:interview_languages).group(:id).having("COUNT(DISTINCT interview_languages.language_id) > 1").exists?
      'mul'
    else
      interviews.first&.interview_languages&.first&.language&.code || ''
    end
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
