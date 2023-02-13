xml.instruct!
xml.resource "xsi:schemaLocation": "http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4/metadata.xsd", xmlns: "http://datacite.org/schema/kernel-4", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" do

  xml.identifier identifierType: "DOI" do 
    xml.text! "#{Rails.configuration.datacite['prefix']}/#{interview.project.identifier}.#{interview.archive_id}"
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
    xml.title "Interview mit #{interview.anonymous_title(locale)}, interviewt von #{interview.interviewers.first && interview.interviewers.first.first_name(locale)} #{interview.interviewers.first && interview.interviewers.first.last_name(locale)} am #{interview.interview_date && Date.parse(interview.interview_date).strftime('%d.%m.%Y')}"
  end

  xml.publisher "Interview-Archiv \"#{interview.project.name(locale)}\""
  xml.publicationYear DateTime.now.year

  xml.contributors do
    [
      %w(interviewers Interviewführung), 
      %w(cinematographers Kamera),
      %w(transcriptors Transkripteur),
      %w(translators Übersetzer),
      %w(segmentators Erschließer)
    ].each do |contributors, contribution|
      if interview.send(contributors).length > 0
        xml.contributor contributorType: "DataCollector" do 
          xml.contributorName interview.send(contributors).map{|contributor| "#{contributor.last_name(locale)}, #{contributor.first_name(locale)}"}.join('; ') + " (#{contribution})"
        end
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
      xml.subject "#{field.label(locale)}: #{interview.send(field.name).map{|f| RegistryEntry.find(f).to_s(locale)}.join(', ')}"
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
    interview.project.external_links.each do |external_link|
      xml.rights rightsURI: "#{external_link.url}" do 
        xml.text! "#{external_link.name(locale)} des Interview-Archivs \"#{interview.project.name(locale)}\""
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
