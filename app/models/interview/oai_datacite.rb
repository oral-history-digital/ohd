module Interview::OaiDatacite
  def to_oai_datacite(xml = Builder::XmlMarkup.new)
    xml.tag!(
      "resource",
      "xmlns": "http://datacite.org/schema/kernel-4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation": %w(
        http://datacite.org/schema/kernel-4
        http://schema.datacite.org/meta/kernel-4.6/metadata.xsd
      ).join(" ")
    ) do

      xml.identifier oai_url_identifier(project.default_locale), identifierType: "URL"

      xml.alternateIdentifiers do
        alternate_oai_locales.each do |locale|
          xml.alternateIdentifier oai_url_identifier(locale),
            alternateIdentifierType: "URL"
        end
        if doi_status == "created"
          xml.alternateIdentifier oai_doi_identifier,
            alternateIdentifierType: "DOI"
        end
      end

      xml.relatedIdentifiers do
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf",
          resourceTypeGeneral: "Dataset"
        if collection_id
          xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/collections/#{collection_id}",
            relatedIdentifierType: "URL",
            relationType: "IsPartOf",
            resourceTypeGeneral: "Collection"
        end
      end

      xml.titles do
        [:de, :en].each do |locale|
          xml.title oai_title(locale), "xml:lang": locale
        end
      end

      xml.creators do
        interviewees.each do |interviewee|
          xml.creator do
            xml.creatorName anonymous_title(:en), "xml:lang": "en"
            if project.fullname_on_landing_page
              xml.familyName interviewee.last_name(:en)
            end
          end
        end
      end

      xml.publisher oai_publisher(:en), "xml:lang": "en"

      if oai_publication_date
        xml.publicationYear oai_publication_date
      end

      xml.contributors do
        xml.contributor contributorType: "DataManager" do
          xml.contributorName project.name(:en),
            "xml:lang": "en",
            nameType: "Organizational"
        end
        project.cooperation_partners.each do |cooperation_partner|
          xml.contributor contributorType: "DataCollector" do
            xml.contributorName "#{cooperation_partner.name.gsub("'", "")} (Cooperation Partner)",
              "xml:lang": "en",
              nameType: "Organizational"
          end
        end
        if project.interviewer_on_landing_page?
          xml.contributor contributorType: "DataCollector" do
            xml.contributorName interviewers.map{|i| i.full_name(:en)}.join(", "),
              "xml:lang": "en",
              nameType: "Personal"
          end
        end
        project.oai_leaders.each do |leader|
          xml.contributor contributorType: "ProjectLeader" do
            xml.contributorName leader,
              "xml:lang": "en",
              nameType: "Personal"
          end
        end
        project.oai_managers.each do |manager_name|
          xml.contributor contributorType: "ContactPerson" do
            xml.contributorName manager_name.strip,
              "xml:lang": "en",
              nameType: "Personal"
          end
        end
        if !oai_contributor(:en).blank?
          xml.contributor contributorType: "HostingInstitution" do
            xml.contributorName oai_contributor(:en),
              "xml:lang": "en",
              nameType: "Organizational"
          end
        end
      end

      xml.fundingReferences do
        project.oai_funders.each do |funder|
          xml.fundingReference do
            xml.funderName funder
          end
        end
      end
        
      xml.dates do
        xml.date oai_date,
          dateType: "Created",
          dateInformation: "Interview date"
        xml.date oai_publication_date,
          dateType: "Issued",
          dateInformation: "published via Oral-History.Digital"
      end

      xml.resourceType oai_type, resourceTypeGeneral: "Audiovisual"

      xml.formats do
        xml.format oai_format
      end

      xml.sizes do
        xml.size oai_size
      end

      xml.language oai_language

      xml.subjects do
        oai_base_subject_tags(xml, :datacite)
        oai_subjects_tags(xml, :datacite)
        oai_countries_tags(xml, :datacite)
        oai_findability_tags(xml, :datacite)
      end

      xml.rightsList do
        oai_locales.each do |locale|
          xml.rights "#{TranslationValue.for('conditions', locale)} (#{project.name(locale)})",
            "xml:lang": locale,
            rightsURI: "#{project.domain_with_optional_identifier}/#{locale}/conditions"
          xml.rights "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)",
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/conditions"
          xml.rights TranslationValue.for('privacy_protection', locale),
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/privacy_protection"
        end
        #[:de, :en].each do |locale|
          #xml.rights "#{TranslationValue.for('metadata_licence', locale)}: Attribution-NonCommercial-ShareAlike 4.0 International",
            #"xml:lang": locale,
            #rightsIdentifier: "CC-BY-4.0",
            #rightsURI: "http://creativecommons.org/licenses/by-nc-sa/4.0/"
        #end
      end

    end
    xml.target!
  end
end

