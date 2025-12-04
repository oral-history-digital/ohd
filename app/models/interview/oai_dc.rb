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

      [:de, :en].each do |locale|
        xml.tag!('dc:identifier', oai_url_identifier(locale), "xml:lang": locale)
        xml.tag!('dc:title', oai_title(locale), "xml:lang": locale)
      end

      interviewees.each do |interviewee|
        oai_locales.each do |locale|
          xml.tag!('dc:creator', anonymous_title(locale), "xml:lang": locale)
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:publisher', oai_publisher(locale), "xml:lang": locale)
        xml.tag!('dc:contributor', oai_contributor(locale), "xml:lang": locale)
      end

      xml.tag!('dc:date', oai_date)

      xml.tag!('dc:type', oai_type)

      xml.tag!('dc:format', oai_format)

      xml.tag!('dc:language', oai_language)

      oai_subject_registry_entries.each do |registry_entry|
        [:de, :en].each do |locale|
          xml.tag!('dc:subject', registry_entry.to_s(locale), "xml:lang": locale)
        end
      end

      oai_locales.each do |locale|
        xml.tag!('dc:rights', "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions", "xml:lang": locale)
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

