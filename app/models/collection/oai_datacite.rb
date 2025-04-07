module Collection::OaiDatacite
  def to_oai_datacite
    xml = Builder::XmlMarkup.new
    xml.tag!(
      "resource",
      "xmlns": "http://datacite.org/schema/kernel-4",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation": %(
        http://datacite.org/schema/kernel-4
        http://schema.datacite.org/meta/kernel-4.1/metadata.xsd
      ).gsub(/\s+/, " ")
    ) do
      xml.identifier do
        xml.text! oai_identifier
      end

      oai_locales.each do |locale|
        xml.alternateIdentifier "xml:lang": locale, identfierType: "URL" do
          xml.text! oai_url_identifier(locale)
        end
      end

      xml.titles do
        oai_locales.each do |locale|
          xml.title "xml:lang": locale do
            xml.text! oai_title(locale)
          end
        end
      end

      xml.creators do
        xml.creator do
          xml.creatorName oai_creator(:de)
        end
      end

      oai_locales.each do |locale|
        xml.publisher "xml:lang": locale do
          xml.text! oai_publisher(locale)
        end
      end
      xml.publicationYear DateTime.now.year

      xml.contributors do
        xml.contributor contributorType: "DataManager" do
          xml.contributorName project.manager
        end
        xml.contributor contributorType: "HostingInstitution" do
          oai_locales.each do |locale|
            xml.contributorName("xml:lang": locale) do
              xml.contributorName oai_contributor(locale)
            end
          end
        end
      end

      xml.resourceType resourceTypeGeneral: "Audiovisual" do 
        xml.text! "audio/video"
      end

      xml.formats do
        oai_formats.each do |format|
          xml.format format
        end
      end

      xml.sizes do
        xml.size oai_size
      end

      oai_languages.each do |language|
        xml.language language
      end

      xml.rightsList do
        oai_locales.each do |locale|
          xml.rights(
            "xml:lang": locale,
            rightsURI: "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
          ) do
            xml.text! "#{TranslationValue.for('conditions', locale)} (#{name(locale)})"
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
        oai_locales.each do |locale|
          xml.rights "xml:lang": locale, rightsURI: "#{OHD_DOMAIN}/#{locale}/privacy_protection" do
            xml.text! TranslationValue.for('privacy_protection', locale)
          end
        end
      end

      xml.relatedIdentifiers do
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "IsPartOf" do
          xml.text! OHD_DOMAIN
        end
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "IsPartOf" do
          xml.text! "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}"
        end
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "IsSupplementTo" do
          xml.text! project.domain
        end
        xml.relatedIdentifier relatedIdentifierType: "URL", relationType: "HasPart" do
          xml.text! "https://portal.oral-history.digital/de/oai_repository?verb=ListRecords&metadataPrefix=oai_datacite&set=collection:#{id}"
        end
      end

      xml.descriptions do
        oai_locales.each do |locale|
          xml.description "xml:lang": locale, descriptionType: "Abstract" do
            xml.text! oai_abstract_description(locale)
          end
          xml.description "xml:lang": locale, descriptionType: "TechnicalInfo" do
            xml.text! oai_media_files_description(locale)
          end
          xml.description "xml:lang": locale, descriptionType: "TechnicalInfo" do
            xml.text! oai_transcript_description(locale)
          end
        end
      end

    end
    xml.target!
  end
end




