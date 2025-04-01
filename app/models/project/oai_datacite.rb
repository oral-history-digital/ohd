module Project::OaiDatacite
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
      xml.tag!('titles') do
        %w(de en).each do |locale|
          xml.tag!('title', 'xml:lang': locale) do
            xml.text! name(locale)
          end
        end
      end
    end
    xml.target!
  end
end


