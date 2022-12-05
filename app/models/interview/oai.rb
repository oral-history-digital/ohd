module Interview::Oai

  def oai_dc_identifier
    "oai:#{project.identifier}:#{archive_id}"
  end

  def oai_dc_creator
    anonymous_title(:de)
  end

  def oai_dc_subject
    #project.registry_reference_type_metadata_fields.where(use_in_results_table: true, ref_object_type: 'Interview').each do |field|
      #"#{field.label(project.default_locale)}: #{self.send(field.name).map{|f| RegistryEntry.find(f).to_s(project.default_locale)}.join(';')}"
    #end
  end

  def oai_dc_title
    "Lebensgeschichtliches #{media_type.classify}-Interview mit #{anonymous_title(:de)} vom #{interview_date}"
  end

  def oai_dc_description
    "#{media_type.classify}-Interview in #{language.name(:de)} Sprache."
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{project.name('de')}\""
  end

  def oai_dc_contributor
    project.institutions.map{|i| i.name(:de)} + [project.cooperation_partner]
  end

  def oai_dc_date
    interview_date && Date.parse(interview_date).strftime("%d.%m.%Y") rescue interview_date
  end

  def oai_dc_type
    'Interview'
  end

  def type
    'Interview'
  end

  def oai_dc_format
    media_type.classify
  end

  def oai_dc_source
    project.domain_with_optional_identifier 
  end

  def oai_dc_language
    language && language.name(:de)
  end

  def oai_dc_relation
    collection && collection.name(:de)
  end

  #def oai_dc_coverage
  #end

  def oai_dc_rights
    link = project.external_links.where(internal_name: 'conditions').first
    link && link.url
  end

end
