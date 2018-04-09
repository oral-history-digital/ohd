xml.instruct!
xml.resource "xsi:schemaLocation": "http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4/metadata.xsd", xmlns: "http://datacite.org/schema/kernel-4", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance" do

  xml.identifier identifierType: "DOI" do 
    xml.text! "doi:10.17169/#{@interview.archive_id}"
  end

  xml.AlternateIdentifier AlternateIdentifierType: "URL" do
    xml.text! "https://archive.occupation-memories.org/de/interviews/#{@interview.archive_id}"
  end

  xml.creators do
    @interview.interviewees.each do |interviewee|
      xml.creator do
        xml.creatorName "#{interviewee.last_name(:deu)}, #{interviewee.first_name(:deu)}"
        xml.givenName interviewee.first_name(:deu)
        xml.familyName interviewee.last_name(:deu)
      end
    end
  end

  xml.titles do
    xml.title "Lebensgeschichtliches Interview mit #{@interview.interviewees.first.first_name} #{@interview.interviewees.first.last_name}"
  end

  xml.publisher "Interview-Archiv \"Erinnerungen an die Okkupation in Griechenland\""
  xml.publicationYear 2018

  xml.contributors do
    xml.contributor contributorType: "DataCollector" do 
      @interview.interviewers.each do |interviewer|
        xml.contributorName "#{interviewer.last_name(:deu)}, #{interviewer.first_name(:deu)}(Interviewfuehrung)"
      end
    end
    xml.contributor contributorType: "DataCollector" do 
      @interview.cinematographers.each do |cinematographer|
        xml.contributorName "#{cinematographer.last_name(:deu)}, #{cinematographer.first_name(:deu)}(Kamera)"
      end
    end
    xml.contributor contributorType: "DataCollector" do 
      xml.contributorName "Nationale Kapodistrias-Universität Athen (Kooperationspartner)"
    end
    xml.contributor contributorType: "DataCurator" do 
      @interview.transcriptors.each do |transcriptor|
        xml.contributorName "#{transcriptor.last_name(:deu)}, #{transcriptor.first_name(:deu)}"
      end
    end
    xml.contributor contributorType: "ProjectLeader" do 
      xml.contributorName "Apostolopoulos, Nicolas; Fleischer, Hagen"
    end
    xml.contributor contributorType: "HostingInstitution" do 
      xml.contributorName "Freie Universität Berlin"
    end
  end

  xml.subjects do
    xml.subject "Erfahrungen: #{@interview.typology.map{|t| I18n.t(t.gsub(' ', '_').downcase)}.join(', ')}"
  end

  xml.language "el"

  xml.resourceType resourceTypeGeneral: "Audiovisual" do 
    "Video-Interview"
  end

  xml.formats do
    xml.format "video/mp4"
  end

  xml.sizes do
    xml.size Time.at(@interview.duration).utc.strftime("%H:%M")
  end

  xml.descriptions do
    xml.description descriptionType: "Abstract" do
      xml.text! "Lebensgeschichtliches Video-Interview in griechischer Sprache mit Transkription, deutscher Übersetzung, Erschließung, Kurzbiografie und Fotografien"
    end
  end

  xml.rightsList do
    xml.rights rightsURI: "http://www.occupation-memories.org/de/archive/terms/index.html" do 
      xml.text! "Nutzungsbedingungen des Interview-Archivs \"Erinnerungen an die Okkupation in Griechenland\""
    end
  end

  xml.fundingReferences do
    xml.fundingReference do
      xml.funderName "Auswärtiges Amt der Bundesrepublik Deutschland"
    end
    xml.fundingReference do
      xml.funderName "Stavros Niarchos Foundation"
    end
    xml.fundingReference do
      xml.funderName "Stiftung \"Erinnerung, Verantwortung und Zukunft\""
    end
  end
    
  xml.dates do
    xml.date dateType: "Created" do
      xml.text! @interview.interview_date
    end
  end

end
