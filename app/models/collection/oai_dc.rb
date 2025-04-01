module Collection::OaiDc

  def oai_dc_identifier
    "oai:#{shortname}"
    #"oai:#{project.shortname}:#{shortname}"
  end

  def oai_dc_creator
    project.leader
  end

  def oai_dc_subject
    "Interview Sammlung"
  end

  def oai_dc_title
    name(:de)
  end

  def oai_dc_description
    "Interview Sammlung"
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{name('de')}\""
  end

  def oai_dc_contributor
    "#{institution&.name(:de)} #{[project.cooperation_partner]}"
  end

  def oai_dc_date
  end

  def oai_dc_type
    'Sammlung'
  end

  def type
    'Collection'
  end

  def oai_dc_format
  end

  def oai_dc_source
  end

  def oai_dc_language
  end

  #def oai_dc_relation
  #end

  #def oai_dc_coverage
  #end

  def oai_dc_rights
    "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
  end

end

