module Interview::OaiDatacite
  def to_oai_datacite(xml = Builder::XmlMarkup.new)
    xml.tag!(
      "resource",
      "xmlns": "http://datacite.org/schema/kernel-4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation": %(
        http://datacite.org/schema/kernel-4
        http://schema.datacite.org/meta/kernel-4.6/metadata.xsd
      ).gsub(/\s+/, " ")
    ) do

      xml.identifier oai_url_identifier(:de), identifierType: "URL"

      xml.alternateIdentifiers do
        xml.alternateIdentifier oai_url_identifier(:en), alternateIdentifierType: "URL"
      end

      #xml.alternateIdentifiers do
        #oai_locales.each do |locale|
          #xml.alternateIdentifier alternateIdentifierType: "URL" do
            #xml.text! oai_url_identifier(locale)
          #end
        #end
        ##xml.alternateIdentifier alternateIdentifierType: "DOI" do
          ##xml.text! oai_doi_identifier
        ##end
      #end

      xml.relatedIdentifiers do
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf"
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/collections/#{collection_id}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf"
      end

      xml.titles do
        [:de, :en].each do |locale|
          xml.title oai_title(locale), "xml:lang": locale
        end
      end

      xml.creators do
        interviewees.each do |interviewee|
          xml.creator do
            xml.creatorName anonymous_title(:de)
            if project.fullname_on_landing_page
              xml.familyName interviewee.last_name(:de)
            end
          end
        end
      end

      xml.publisher oai_publisher(:en), "xml:lang": "en"

      if oai_publication_date
        xml.publicationYear oai_publication_date
      end

      xml.contributors do
        if !project.cooperation_partner.blank?
          xml.contributor contributorType: "DataCollector" do
            xml.contributorName "#{project.cooperation_partner} (Kooperationspartner)", "xml:lang": "en"
          end
        end
        xml.contributor contributorType: "ProjectLeader" do
          xml.contributorName project.leader, "xml:lang": "en"
        end
        xml.contributor contributorType: "ProjectManager" do
          xml.contributorName project.manager, "xml:lang": "en"
        end
        xml.contributor contributorType: "HostingInstitution" do
          xml.contributorName oai_contributor(:en), "xml:lang": "en"
        end
      end

      xml.fundingReferences do
        project.funder_names.each do |funder|
          xml.fundingReference do
            xml.funderName funder
          end
        end
      end
        
      xml.dates do
        xml.date oai_date, dateType: "Created"
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
        oai_subject_registry_entries.each do |registry_entry|
          [:de, :en].each do |locale|
            xml.subject registry_entry.to_s(locale), "xml:lang": locale
          end
        end
      end

      xml.rightsList do
        oai_locales.each do |locale|
          xml.rights "#{TranslationValue.for('conditions', locale)} (#{project.name(locale)})",
            "xml:lang": locale,
            rightsURI: "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
          xml.rights "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)",
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/conditions"
          xml.rights TranslationValue.for('privacy_protection', locale),
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/privacy_protection"
        end
        [:de, :en].each do |locale|
          xml.rights "#{TranslationValue.for('metadata_licence', locale)}: Attribution-NonCommercial-ShareAlike 4.0 International",
            "xml:lang": locale,
            rightsIdentifier: "CC-BY-4.0",
            rightsURI: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
        end
      end

    end
    xml.target!
  end
end



