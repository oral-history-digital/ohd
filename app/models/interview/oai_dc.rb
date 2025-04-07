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

      oai_subject_registry_entry_ids.each do |registry_entry_ids|
        unless registry_entry_ids.empty?
          oai_locales.each do |locale|
            xml.tag!('dc:subject', "xml:lang": locale) do
              xml.text! registry_entry_ids.map{|f| RegistryEntry.find(f).to_s(locale)}.join(', ')
            end
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

  def oai_dc_identifier
    oai_identifier
  end

  def oai_dc_creator
    anonymous_title(:de)
  end

  def oai_dc_subject
    oai_subjects
  end

  def oai_dc_title
    oai_title(:de)
  end

  def oai_dc_description
    "#{media_type.classify}-Interview auf #{language.name(:de)}."
  end

  def oai_dc_publisher
    "Interview-Archiv \"#{project.name('de')}\""
  end

  def oai_dc_contributor
    oai_contributor
  end

  def oai_dc_date
    oai_date
  end

  def oai_dc_type
    oai_type
  end

  def oai_dc_format
    oai_format
  end

  def oai_dc_source
    project.domain_with_optional_identifier 
  end

  def oai_dc_language
    oai_language
  end

  def oai_dc_relation
    collection && collection.name(:de)
  end

  #def oai_dc_coverage
  #end

  def oai_dc_rights
    "#{project.domain_with_optional_identifier}/#{project.default_locale}/conditions"
  end

end

