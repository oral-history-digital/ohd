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

      xml.identifier identifierType: "URL" do
        xml.text! oai_url_identifier(:de)
      end

      xml.alternateIdentifiers do
        xml.alternateIdentifier alternateIdentifierType: "URL" do
          xml.text! oai_url_identifier(:en)
        end
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
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "IsPartOf" do
          xml.text! "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}"
        end
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "IsPartOf" do
          xml.text! "#{OHD_DOMAIN}/de/catalog/collections/#{collection_id}"
        end
      end

      xml.titles do
        [:de, :en].each do |locale|
          xml.title "xml:lang": locale do
            xml.text! oai_title(locale)
          end
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

      xml.publisher oai_publisher(:de)

      if oai_publication_date
        xml.publicationYear oai_publication_date
      end

      xml.contributors do
        if !project.cooperation_partner.blank?
          xml.contributor contributorType: "DataCollector" do
            xml.contributorName "#{project.cooperation_partner} (Kooperationspartner)"
          end
        end
        xml.contributor contributorType: "ProjectLeader" do
          xml.contributorName project.leader
        end
        xml.contributor contributorType: "ProjectManager" do
          xml.contributorName project.manager
        end
        xml.contributor contributorType: "HostingInstitution" do
          xml.contributorName oai_contributor(:de)
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
        xml.date dateType: "Created" do
          xml.text! oai_date
        end
      end

      xml.resourceType resourceTypeGeneral: "Audiovisual" do
        xml.text! oai_type
      end

      xml.formats do
        xml.format oai_format
      end

      xml.sizes do
        xml.size oai_size
      end

      xml.language oai_language

      xml.subjects do
        oai_subject_registry_entry_ids.each do |registry_entry_id|
          [:de, :en].each do |locale|
            xml.subject "xml:lang": locale do
              xml.text! RegistryEntry.find(registry_entry_id).to_s(locale)
            end
          end
        end
      end

      xml.rightsList do
        oai_locales.each do |locale|
          xml.rights(
            "xml:lang": locale,
            rightsURI: "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
          ) do
            xml.text! "#{TranslationValue.for('conditions', locale)} (#{project.name(locale)})"
          end
        end
        oai_locales.each do |locale|
          xml.rights "xml:lang": locale, rightsURI: "#{OHD_DOMAIN}/#{locale}/conditions" do
            xml.text! "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)"
          end
        end
        oai_locales.each do |locale|
          xml.rights "xml:lang": locale, rightsURI: "#{OHD_DOMAIN}/#{locale}/privacy_protection" do
            xml.text! TranslationValue.for('privacy_protection', locale)
          end
        end
        [:de, :en].each do |locale|
          xml.rights(
            "xml:lang": locale,
            rightsIdentifier: "CC-BY-4.0",
            rightsURI: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
          ) do
            xml.text! "#{TranslationValue.for('metadata_licence', locale)}: Attribution-NonCommercial-ShareAlike 4.0 International"
          end
        end
      end

    end
    xml.target!
  end
end



