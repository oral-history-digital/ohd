xml.instruct!
xml.resource "xsi:schemaLocation": "http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4/metadata.xsd", xmlns: "http://datacite.org/schema/kernel-4", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" do

  xml.identifier identifierType: "DOI" do 
    xml.text! "#{Rails.configuration.datacite['prefix']}/#{interview.project.shortname}.#{interview.archive_id}"
  end

  #xml.AlternateIdentifier AlternateIdentifierType: "URL" do
    #xml.text! "https://archive.occupation-memories.org/de/interviews/#{interview.archive_id}"
  #end

  xml.creators do
    interview.interviewees.each do |interviewee|
      xml.creator do
        xml.creatorName interview.anonymous_title(locale)
        xml.givenName interviewee.first_name(locale)
        if interview.project.fullname_on_landing_page
          xml.familyName interviewee.last_name(locale)
        end
      end
    end
  end

  xml.titles do
    xml.title "Interview mit #{interview.anonymous_title(locale)}, interviewt von #{interview.interviewers.first && interview.interviewers.first.first_name(locale)} #{interview.interviewers.first && interview.interviewers.first.last_name(locale)} am #{interview.interview_date && Date.parse(interview.interview_date).strftime('%d.%m.%Y') rescue interview.interview_date}"
  end

  xml.publisher "Interview-Archiv \"#{interview.project.name(locale)}\""
  xml.publicationYear DateTime.now.year

  xml.contributors do
    interview.contributions.group_by{|c| c.contribution_type}.each do |contribution_type, contributions|
      xml.contributor contributorType: "DataCollector" do 
        xml.contributorName contributions.map{|c|
          "#{c.person.last_name(locale)}, #{c.person.first_name(locale)}"
        }.join('; ') + " (#{contribution_type.label(locale)})"
      end
    end
    if !interview.project.cooperation_partner.blank?
      xml.contributor contributorType: "DataCollector" do 
        xml.contributorName "#{interview.project.cooperation_partner} (Kooperationspartner)"
      end
    end
    xml.contributor contributorType: "ProjectLeader" do 
      xml.contributorName interview.project.leader
    end
    xml.contributor contributorType: "ProjectManager" do 
      xml.contributorName interview.project.manager
    end
    xml.contributor contributorType: "HostingInstitution" do 
      xml.contributorName interview.project.institutions.map(&:name).join(", ")
    end
  end

  xml.subjects do
    interview.project.registry_reference_type_metadata_fields.each do |field|
      registry_entry_ids = case field.ref_object_type
      when "Person"
        interview.interviewee.registry_references
      when "Interview"
        interview.registry_references
      when "Segment"
        interview.segment_registry_references
      end.where(registry_reference_type_id: field.registry_reference_type_id).
      map(&:registry_entry_id).uniq

      xml.subject "#{field.label(locale)}: #{registry_entry_ids.map{|f| RegistryEntry.find(f).to_s(locale)}.join(', ')}"
    end
  end

  xml.language ISO_639.find(interview.language.code.split(/[\/-]/)[0]).alpha2

  xml.resourceType resourceTypeGeneral: "Audiovisual" do 
    xml.text! "#{interview.video}-Interview"
  end

  xml.formats do
    xml.format "video/mp4"
  end

  xml.sizes do
    if interview.duration
      xml.size Time.at(interview.duration).utc.strftime("%H h %M min")
    end
  end

  xml.descriptions do
    xml.description descriptionType: "Abstract" do
      xml.text! "#{interview.video}-Interview in #{interview.language.name.downcase}er Sprache."
    end
  end

  xml.rightsList do
    %w(conditions privacy_protection).each do |field|
      xml.rights rightsURI: "#{OHD_DOMAIN}/#{locale}/field" do 
        xml.text! "#{I18n.t(field, locale: locale)} des Interview-Archivs \"#{interview.project.name(locale)}\""
      end
    end
  end

  xml.fundingReferences do
    interview.project.funder_names.each do |funder|
      xml.fundingReference do
        xml.funderName funder
      end
    end
  end
    
  xml.dates do
    xml.date dateType: "Created" do
      xml.text! interview.interview_date && Date.parse(interview.interview_date).strftime("%d.%m.%Y")
    end
  end

end
