module Collection::OaiDatacite
  def to_oai_datacite
    xml = Builder::XmlMarkup.new
    xml.tag!(
      "resource",
      "xmlns": "http://datacite.org/schema/kernel-4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation": %(
        http://datacite.org/schema/kernel-4
        http://schema.datacite.org/meta/kernel-4.6/metadata.xsd
      ).gsub(/\s+/, " ")
    ) do

      xml.identifier oai_catalog_identifier(:de), identifierType: "URL"

      xml.alternateIdentifiers do
        xml.alternateIdentifier oai_catalog_identifier(:en), alternateIdentifierType: "URL"
      end

      xml.relatedIdentifiers do
        xml.relatedIdentifier OHD_DOMAIN,
          relatedIdentifierType: "URL",
          relationType: "IsPartOf"
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf"
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/oai_repository?verb=GetRecord&metadataPrefix=oai_datacite&identifier=oai:oral-history.digital:#{project.shortname}",
          relatedIdentifierType: "URL",
          relationType: "IsPartOf"
        if project.domain
          xml.relatedIdentifier project.domain,
            relatedIdentifierType: "URL",
            relationType: "IsSupplementTo"
        end
        xml.relatedIdentifier "#{OHD_DOMAIN}/de/oai_repository?verb=ListRecords&metadataPrefix=oai_datacite&set=collection:#{id}",
          relatedIdentifierType: "URL",
          relationType: "HasPart"
      end

      xml.titles do
        oai_locales.each do |locale|
          xml.title oai_title(locale), "xml:lang": locale
        end
      end

      xml.creators do
        xml.creator do
          xml.creatorName oai_creator(:de)
        end
      end

      xml.publisher oai_publisher(:en), "xml:lang": "en"

      if oai_publication_date
        xml.publicationYear oai_publication_date
      end

      xml.contributors do
        xml.contributor contributorType: "DataManager" do
          xml.contributorName project.leader, "xml:lang": "en"
        end
        xml.contributor contributorType: "HostingInstitution" do
          xml.contributorName oai_contributor(:en), "xml:lang": "en"
        end
      end

      xml.resourceType "audio/video", resourceTypeGeneral: "Audiovisual"

      xml.formats do
        oai_formats.each do |format|
          xml.format format
        end
      end

      xml.sizes do
        xml.size oai_size
      end

      #<dates>
      #<date dateType="Coverage">2005</date>
      #<date dateType="Other" dateInformation="years of birth">1922-1933</date>
      #</dates>
      xml.dates do
        xml.date oai_coverage, dateType: "Coverage"
        xml.date oai_birth_years, dateType: "Other", dateInformation: "years of birth"
      end

      xml.language oai_languages

      xml.subjects do
        oai_subject_registry_entry_ids.each do |registry_entry_id|
          [:de, :en].each do |locale|
            xml.subject RegistryEntry.find(registry_entry_id).to_s(locale), "xml:lang": locale
          end
        end
      end

      xml.rightsList do
        oai_locales.each do |locale|
          xml.rights "#{TranslationValue.for('conditions', locale)} (#{name(locale)})",
            "xml:lang": locale,
            rightsURI: "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
          xml.rights "#{TranslationValue.for('conditions', locale)} (Oral-History.Digital)",
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/conditions"
          xml.rights TranslationValue.for('privacy_protection', locale),
            "xml:lang": locale,
            rightsURI: "#{OHD_DOMAIN}/#{locale}/privacy_protection"
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

      xml.descriptions do
        oai_locales.each do |locale|
          xml.description oai_abstract_description(locale),
            "xml:lang": locale,
            descriptionType: "Abstract"
          xml.description oai_media_files_description(locale),
            "xml:lang": locale,
            descriptionType: "TechnicalInfo"
          xml.description oai_transcript_description(locale),
            "xml:lang": locale,
            descriptionType: "TechnicalInfo"
        end
      end

    end
    xml.target!
  end
end
