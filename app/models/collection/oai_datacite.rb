module Collection::OaiDatacite
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

      xml.identifier oai_catalog_identifier(:de), identifierType: "URL"

      xml.alternateIdentifiers do
        xml.alternateIdentifier oai_catalog_identifier(:en), alternateIdentifierType: "URL"
        if doi_status == "created"
          xml.alternateIdentifier oai_doi_identifier, alternateIdentifierType: "DOI"
        end
      end

      xml.relatedIdentifiers do
        xml.relatedIdentifier OHD_DOMAIN,
          relatedIdentifierType: "URL",
          relationType: "IsPartOf",
          resourceTypeGeneral: "Dataset"
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf",
          resourceTypeGeneral: "Dataset"
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:#{project.shortname}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf",
          resourceTypeGeneral: "Dataset"
        if homepage.present?
          xml.relatedIdentifier homepage,
            relatedIdentifierType: "URL",
            relationType: "IsSupplementTo",
            resourceTypeGeneral: "Collection"
        end
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/oai_repository?verb=ListRecords&metadataPrefix=oai_datacite&set=collection:#{id}",
          relatedIdentifierType: "URL",
          relationType: "HasPart",
          resourceTypeGeneral: "Audiovisual"
      end

      xml.titles do
        oai_locales.each do |locale|
          xml.title oai_title(locale), "xml:lang": locale
        end
      end

      if project.institutions.any?
        xml.creators do
          project.institutions.leaf.each do |institution|
            xml.creator do
              xml.creatorName institution.with_ancestors.map{|i| i.name(:en)}.join(", "), "xml:lang": "en", nameType: "Organizational"
              xml.nameIdentifier institution.isil, schemeURI: "http://isil.staatsbibliothek-berlin.de/isil/", nameIdentifierScheme: "ISIL" unless institution.isil.blank?
              xml.nameIdentifier institution.gnd, schemeURI: "http://dnb.de/gnd/", nameIdentifierScheme: "Gemeinsame Normdatei (GND-Organisationen)" unless institution.gnd.blank?
            end
          end
        end
      end

      unless oai_publisher(:en).blank?
        xml.publisher oai_publisher(:en), "xml:lang": "en"
      end

      if oai_publication_date
        xml.publicationYear oai_publication_date
      end

      xml.contributors do
        #project.cooperation_partners.each do |cooperation_partner|
          #xml.contributor contributorType: "DataCollector" do
            #xml.contributorName "#{cooperation_partner.name.gsub("'", "")} (Cooperation Partner)",
              #"xml:lang": "en",
              #nameType: "Organizational"
          #end
        #end
        #project.oai_leaders.each do |leader|
          #xml.contributor contributorType: "ProjectLeader" do
            #xml.contributorName leader,
              #"xml:lang": "en",
              #nameType: "Personal"
          #end
        #end
        #if project.interviewer_on_landing_page?
          #xml.contributor contributorType: "DataCollector" do
            #xml.contributorName interviewers.map(&:full_name).join(", "),
              #"xml:lang": "en",
              #nameType: "Personal"
          #end
        #end
        #project.oai_managers.each do |manager|
          #xml.contributor contributorType: "ProjectManager" do
            #xml.contributorName manager,
              #"xml:lang": "en",
              #nameType: "Personal"
          #end
        #end
        xml.contributor contributorType: "HostingInstitution" do
          xml.contributorName oai_contributor(:en),
            "xml:lang": "en",
            nameType: "Organizational"
        end
      end

      xml.resourceType oai_type, resourceTypeGeneral: "Audiovisual"

      xml.formats do
        oai_formats.each do |format|
          xml.format format
        end
      end

      xml.sizes do
        xml.size oai_size
      end

      xml.version "1.0"

      xml.language oai_languages

      xml.dates do
        xml.date oai_coverage, dateType: "Coverage"
        xml.date oai_birth_years, dateType: "Other", dateInformation: "Years of birth"
      end

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
            #rightsURI: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
        #end
      end

      xml.descriptions do
        (oai_locales | ['en']).each do |locale|
          xml.description oai_abstract_description(locale),
            "xml:lang": locale,
            descriptionType: "Abstract"
        end
        %w(de en).each do |locale|
          if has_media_files?
            xml.description oai_media_files_description(locale),
              "xml:lang": locale,
              descriptionType: "TechnicalInfo"
          end
          if has_transcripts?
            xml.description oai_transcript_description(locale),
              "xml:lang": locale,
              descriptionType: "TechnicalInfo"
          end
        end
      end

    end
    xml.target!
  end
end
