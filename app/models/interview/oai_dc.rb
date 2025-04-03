module Interview::OaiDc

  def oai_dc_identifier
    oai_identifier
    #"oai:#{project.shortname}:#{archive_id}"
    #project.domain_with_optional_identifier + "/#{project.default_locale}/interviews/#{archive_id}"
  end

  def oai_dc_creator
    anonymous_title(:de)
  end

  def oai_dc_subject
    oai_subjects
  end

  def oai_dc_title
    oai_title(:de)
  end

  def oai_dc_description
    "#{media_type.classify}-Interview auf #{language.name(:de)}."
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{project.name('de')}\""
  end

  def oai_dc_contributor
    oai_contributor
  end

  def oai_dc_date
    oai_date
  end

  def oai_dc_type
    oai_type
  end

  def oai_dc_format
    oai_format
  end

  def oai_dc_source
    project.domain_with_optional_identifier 
  end

  def oai_dc_language
    oai_language
  end

  def oai_dc_relation
    collection && collection.name(:de)
  end

  #def oai_dc_coverage
  #end

  def oai_dc_rights
    "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
  end

end

