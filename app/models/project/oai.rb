module Project::Oai
  include OaiRepository::Set

  def sets
    oai_sets = [ OAI::Set.new({name: 'Interview-Archiv', spec: "archive:#{shortname}"}) ]
    #if name.match('multimeter')
      #oai_sets << OAI::Set.new({name: 'Meters', spec: 'meters'})
    #end
    oai_sets
  end

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
    'Project'
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
    "#{domain_with_optional_identifier}/#{default_locale}/conditions"
  end

end
