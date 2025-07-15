module Project::OaiDc

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
        xml.tag!('dc:identifier', "xml:lang": locale) do
          xml.text! oai_catalog_identifier(locale)
        end
      end

      #xml.tag!('dc:source', oai_identifier)

      oai_locales.each do |locale|
        xml.tag!('dc:title', "xml:lang": locale) do
          xml.text! oai_title(locale)
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:creator', "xml:lang": locale) do
          xml.text! oai_creator(locale)
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:publisher', "xml:lang": locale) do
          xml.text! oai_publisher(locale)
        end
      end

      oai_leaders.each do |leader_name|
        xml.tag!('dc:contributor', leader_name.strip)
      end
      oai_managers.each do |manager_name|
        xml.tag!('dc:contributor', manager_name.strip)
      end
      oai_locales.each do |locale|
        xml.tag!('dc:contributor', "xml:lang": locale) do
          xml.text! oai_contributor(locale)
        end
      end

      if oai_publication_date
        xml.tag!('dc:date', oai_publication_date)
      end

      xml.tag!('dc:type', oai_type)

      oai_formats.each do |format|
        xml.tag!('dc:format', format)
      end

      xml.tag!('dc:language', oai_languages)

      oai_subject_registry_entry_ids.each do |registry_entry_id|
        %w(de en).each do |locale|
          xml.tag!('dc:subject', "xml:lang": locale) do
            xml.text! RegistryEntry.find(registry_entry_id).to_s(locale)
          end
        end
      end

      xml.tag!('dc:relation', domain_with_optional_identifier)
      xml.tag!('dc:relation', "#{OHD_DOMAIN}")
      xml.tag!('dc:relation', domain)
      xml.tag!('dc:relation', "#{OHD_DOMAIN}/de/oai_repository?verb=ListRecords&metadataPrefix=oai_datacite&set=archive:#{shortname}")

      xml.tag!('dc:description', oai_size)
      oai_locales.each do |locale|
        xml.tag!('dc:description', "xml:lang": locale) do
          xml.text! oai_abstract_description(locale)
        end
      end
      %w(de en).each do |locale|
        xml.tag!('dc:description', "xml:lang": locale) do
          xml.text! oai_media_files_description(locale)
        end
        xml.tag!('dc:description', "xml:lang": locale) do
          xml.text! oai_transcript_description(locale)
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "#{domain_with_optional_identifier}/#{locale}/conditions"
        end
      end
      oai_locales.each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "#{OHD_DOMAIN}/#{locale}/conditions"
        end
      end
      oai_locales.each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "#{OHD_DOMAIN}/#{locale}/privacy_protection"
        end
      end
      [:de, :en].each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "CC-BY-4.0 #{TranslationValue.for('metadata_licence', locale)}"
        end
      end

      xml.target!
    end
  end

end
