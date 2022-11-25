module Project::Oai

  def oai_dc_identifier
    "oai:#{shortname}"
  end

  def oai_dc_creator
    leader
  end

  def oai_dc_subject
    "Interview Archiv"
  end

  def oai_dc_title
    name(:de)
  end

  def oai_dc_description
    "Interview Archiv"
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{name('de')}\""
  end

  def oai_dc_contributor
    institutions.map{|i| i.name(:de)} + [cooperation_partner]
  end

  def oai_dc_date
  end

  def oai_dc_type
    'Archiv'
  end

  def type
    'Archiv'
  end

  def oai_dc_format
  end

  def oai_dc_source
    "#{domain_with_optional_identifier}/#{default_locale}"
  end

  def oai_dc_language
    available_locales
  end

  #def oai_dc_relation
  #end

  #def oai_dc_coverage
  #end

  def oai_dc_rights
    link = external_links.where(internal_name: 'conditions').first
    link && link.url
  end

end
