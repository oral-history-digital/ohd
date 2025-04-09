module Interview::OaiDc

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

      xml.tag!('dc:identifier', oai_identifier)

      oai_locales.each do |locale|
        xml.tag!('dc:identifier', "xml:lang": locale, identfierType: "URL") do
          xml.text! oai_url_identifier(locale)
        end
      end

      xml.tag!('dc:identifier', identfierType: "DOI") do
        xml.text! oai_doi_identifier
      end

      oai_locales.each do |locale|
        xml.tag!('dc:title', "xml:lang": locale) do
          xml.text! oai_title(locale)
        end
      end

      interviewees.each do |interviewee|
        oai_locales.each do |locale|
          xml.tag!('dc:creator', "xml:lang": locale) do
            xml.text! anonymous_title(locale)
          end
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:publisher', "xml:lang": locale) do
          xml.text! oai_publisher(locale)
        end
      end

      xml.tag!('dc:date', oai_date)

      xml.tag!('dc:type', oai_type)

      xml.tag!('dc:format', oai_format)

      xml.tag!('dc:language', oai_language)

      oai_subject_registry_entry_ids.each do |registry_entry_id|
        oai_locales.each do |locale|
          xml.tag!('dc:subject', "xml:lang": locale) do
            xml.text! RegistryEntry.find(registry_entry_id).to_s(locale)
          end
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
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
      oai_locales.each do |locale|
        xml.tag!('dc:rights', "xml:lang": locale) do
          xml.text! "CC-BY-4.0 #{TranslationValue.for('metadata_licence', locale)}"
        end
      end

      xml.target!
    end
  end

end

