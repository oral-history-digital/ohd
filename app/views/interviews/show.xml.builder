xml.instruct!
xml.resource "xsi:schemaLocation": "http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4/metadata.xsd", xmlns: "http://datacite.org/schema/kernel-4", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" do

  xml.identifier identifierType: "DOI" do 
    xml.text! "#{Rails.configuration.datacite['prefix']}/#{Project.name}.#{@interview.archive_id}"
  end

  #xml.AlternateIdentifier AlternateIdentifierType: "URL" do
    #xml.text! "https://archive.occupation-memories.org/de/interviews/#{@interview.archive_id}"
  #end

  xml.creators do
    @interview.interviewees.each do |interviewee|
      xml.creator do
        xml.creatorName "#{interviewee.last_name(@locale)}, #{interviewee.first_name(@locale)}"
        xml.givenName interviewee.first_name(@locale)
        xml.familyName interviewee.last_name(@locale)
      end
    end
  end

  xml.titles do
    xml.title "Lebensgeschichtliches Interview mit #{@interview.interviewees.first.first_name(@locale)} #{@interview.interviewees.first.last_name(@locale)}, interviewt von #{@interview.interviewers.first.first_name(@locale)}, #{@interview.interviewers.first.last_name(@locale)} am #{@interview.interview_date && Date.parse(@interview.interview_date).strftime('%d.%m.%Y')}"
  end

  xml.publisher "Interview-Archiv \"#{Project.project_name['de']}\""
  xml.publicationYear DateTime.now.year

  xml.contributors do
    xml.contributor contributorType: "DataCollector" do 
      @interview.interviewers.each do |interviewer|
        xml.contributorName "#{interviewer.last_name(@locale)}, #{interviewer.first_name(@locale)}(Interviewfuehrung)"
      end
    end
    xml.contributor contributorType: "DataCollector" do 
      @interview.cinematographers.each do |cinematographer|
        xml.contributorName "#{cinematographer.last_name(@locale)}, #{cinematographer.first_name(@locale)}(Kamera)"
      end
    end
    xml.contributor contributorType: "DataCollector" do 
      xml.contributorName "#{Project.cooperation_partner} (Kooperationspartner)"
    end
    xml.contributor contributorType: "DataCurator" do 
      @interview.transcriptors.each do |transcriptor|
        xml.contributorName "#{transcriptor.last_name(@locale)}, #{transcriptor.first_name(@locale)}(Transkripteur)"
      end
    end
    xml.contributor contributorType: "DataCurator" do 
      @interview.translators.each do |translator|
        xml.contributorName "#{translator.last_name(@locale)}, #{translator.first_name(@locale)}(Übersetzer)"
      end
    end
    xml.contributor contributorType: "DataCurator" do 
      @interview.segmentators.each do |segmentator|
        xml.contributorName "#{segmentator.last_name(@locale)}, #{segmentator.first_name(@locale)}(Erschließer)"
      end
    end
    xml.contributor contributorType: "ProjectLeader" do 
      xml.contributorName Project.leader
    end
    xml.contributor contributorType: "ProjectManager" do 
      xml.contributorName Project.manager
    end
    xml.contributor contributorType: "HostingInstitution" do 
      xml.contributorName Project.hosting_institution
    end
  end

  xml.subjects do
    if @interview.respond_to?(:typology)
      xml.subject "Erfahrungen: #{@interview.typology.map{|t| I18n.t(t.gsub(' ', '_').downcase, scope: 'search_facets')}.join(', ')}"
    else
      xml.subject "Gruppe: #{@interview.forced_labor_groups.map{|f| RegistryEntry.find(f).to_s(@locale)}.join(', ')}"
      xml.subject "Lager und Einsatzorte: #{@interview.forced_labor_fields.map{|f| RegistryEntry.find(f).to_s(@locale)}.join(', ')}"
    end
  end

  xml.language @interview.language.code

  xml.resourceType resourceTypeGeneral: "Audiovisual" do 
    xml.text! "#{@interview.video}-Interview"
  end

  xml.formats do
    xml.format "video/mp4"
  end

  xml.sizes do
    xml.size Time.at(@interview.duration).utc.strftime("%H h %M min")
  end

  xml.descriptions do
    xml.description descriptionType: "Abstract" do
      xml.text! "Lebensgeschichtliches #{@interview.video}-Interview in #{@interview.language.name.downcase}er Sprache mit Transkription, deutscher Übersetzung, Erschließung, Kurzbiografie und Fotografien"
    end
  end

  xml.rightsList do
    xml.rights rightsURI: "#{Project.external_links['conditions']['de']}" do 
      xml.text! "Nutzungsbedingungen des Interview-Archivs \"#{Project.project_name['de']}\""
    end
  end

  xml.fundingReferences do
    Project.funder_names.each do |funder|
      xml.fundingReference do
        xml.funderName funder
      end
    end
  end
    
  xml.dates do
    xml.date dateType: "Created" do
      xml.text! @interview.interview_date && Date.parse(@interview.interview_date).strftime("%d.%m.%Y")
    end
  end

end
