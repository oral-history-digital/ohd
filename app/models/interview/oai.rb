module Interview::OAI

  def oai_dc_identifier
    "oai:#{project.identifier}:#{archive_id}"
  end

  def oai_dc_creator
    anonymous_title
  end

  def oai_dc_subject
    project.registry_reference_type_metadata_fields.where(use_in_results_table: true, ref_object_type: 'Interview').each do |field|
      "#{field.label(project.default_locale)}: #{self.send(field.name).map{|f| RegistryEntry.find(f).to_s(project.default_locale)}.join(';')}"
    end
  end

  def oai_dc_description
    "Lebensgeschichtliches #{self.video}-Interview in #{self.language.name.downcase}er Sprache mit Transkription, deutscher Übersetzung, Erschließung, Kurzbiografie und Fotografien"
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{project.name('de')}\""
  end

  def oai_dc_contributor
    oai_contributors = project.contribution_types.inject([]) do |mem, contribution_type|
      contributors = self.send(contribution_type.code.pluralize)
      if contributors.length > 0
        "#{I18n.translate(contribution_type.code, locale: :de)}: " + contributors.map{|contributor| "#{contributor.last_name(project.default_locale)}, #{contributor.first_name(project.default_locale)}"}.join('; ')
      end
      mem
    end
    if !project.cooperation_partner.blank?
      oai_contributors << "Kooperationspartner: #{project.cooperation_partner}"
    end
    oai_contributors << "Projektleiter: #{project.leader}"
    oai_contributors << "Projektmanager: #{project.manager}"
    oai_contributors << "Hosting Institution: #{project.institutions.map(&:name).join(', ')}"
    oai_contributors.join('. ')
  end

  def oai_dc_date
    interview_date && Date.parse(interview_date).strftime("%d.%m.%Y") rescue interview_date
  end

  #def oai_dc_type
  #end

  def oai_dc_format
    media_type.classify
  end

  #def oai_dc_source
  #end

  def oai_dc_language
    language && language.name
  end

  #def oai_dc_relation
  #end

  #def oai_dc_coverage
  #end

  #def oai_dc_rights
  #end

end
