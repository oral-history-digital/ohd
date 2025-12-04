module Collection::OaiDc

  def to_oai_dc
    xml = Builder::XmlMarkup.new
    xml.tag!(
      "oai_dc:dc",
      'xmlns:oai_dc' => "http://www.openarchives.org/OAI/2.0/oai_dc/",
      'xmlns:dc' => "http://purl.org/dc/elements/1.1/",
      'xmlns:xsi' => "http://www.w3.org/2001/XMLSchema-instance",
      'xsi:schemaLocation' =>
      %{http://www.openarchives.org/OAI/2.0/oai_dc/
          http://www.openarchives.org/OAI/2.0/oai_dc.xsd}
    ) do

      [:de, :en].each do |locale|
        xml.tag!('dc:identifier', oai_catalog_identifier(locale), "xml:lang": locale)
      end

      xml.tag!('dc:source', oai_identifier)

      oai_locales.each do |locale|
        xml.tag!('dc:title', oai_title(locale), "xml:lang": locale)
        creator = oai_creator(locale)
        unless creator.blank?
          xml.tag!('dc:creator', creator, "xml:lang": locale)
        end
        xml.tag!('dc:publisher', oai_publisher(locale), "xml:lang": locale)
      end

      xml.tag!('dc:contributor', project.manager)
      xml.tag!('dc:contributor', oai_contributor(:de))

      if oai_publication_date
        xml.tag!('dc:date', oai_publication_date)
      end

      xml.tag!('dc:type', oai_type)

      oai_formats.each do |format|
        xml.tag!('dc:format', format)
      end

      xml.tag!('dc:language', oai_languages)

      oai_subject_registry_entry_ids.each do |registry_entry_id|
        [:de, :en].each do |locale|
          xml.tag!('dc:subject', RegistryEntry.find(registry_entry_id).to_s(locale), "xml:lang": locale)
        end
      end

      xml.tag!('dc:relation', OHD_DOMAIN)
      xml.tag!('dc:relation', "#{OHD_DOMAIN}/de/catalog/archives/#{project_id}")
      if project.domain
        xml.tag!('dc:relation', project.domain)
      end
      xml.tag!('dc:relation', "#{OHD_DOMAIN}/de/oai_repository?verb=ListRecords&metadataPrefix=oai_dc&set=collection:#{id}")

      xml.tag!('dc:description', oai_size)
      oai_locales.each do |locale|
        xml.tag!('dc:description', oai_abstract_description(locale), "xml:lang": locale)
        xml.tag!('dc:description', oai_media_files_description(locale), "xml:lang": locale)
        xml.tag!('dc:description', oai_transcript_description(locale), "xml:lang": locale)
        xml.tag!('dc:rights', "#{project.domain_with_optional_identifier}/#{locale}/conditions", "xml:lang": locale)
        xml.tag!('dc:rights', "#{OHD_DOMAIN}/#{locale}/conditions", "xml:lang": locale)
        xml.tag!('dc:rights', "#{OHD_DOMAIN}/#{locale}/privacy_protection", "xml:lang": locale)
      end
      [:de, :en].each do |locale|
        xml.tag!('dc:rights', "CC-BY-4.0 #{TranslationValue.for('metadata_licence', locale)}", "xml:lang": locale)
      end

      xml.target!
    end
  end

end

