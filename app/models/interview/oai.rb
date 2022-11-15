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
    oai_contributors = [
      %w(interviewers Interviewführung),
      %w(cinematographers Kamera),
      %w(transcriptors Transkripteur),
      %w(translators Übersetzer),
      %w(segmentators Erschließer)
    ].inject([]) do |mem, (contributors, contribution)|
      if self.send(contributors).length > 0
        "#{contribution}: " + self.send(contributors).map{|contributor| "#{contributor.last_name(project.default_locale)}, #{contributor.first_name(project.default_locale)}"}.join('; ')
      end
      mem
    end
    if !project.cooperation_partner.blank?
      oai_contributors << "Kooperationspartner: #{project.cooperation_partner}"
    end
    oai_contributors << "Projektleiter: #{project.leader}"
    oai_contributors << "Projektmanager: #{project.manager}"
    oai_contributors << "Hosting Institution: #{project.hosting_institution}"
    oai_contributors.join('. ')
  end

  def oai_dc_date
    self.interview_date && Date.parse(self.interview_date).strftime("%d.%m.%Y")
  end

  #def oai_dc_type
  #end

  def oai_dc_format
    self.video
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
