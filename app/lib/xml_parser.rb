module XMLParser

  require 'nokogiri'

  # Chars to remove before Indexing/Importing
  ILLEGAL_XML_CHARS = /\x00|\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|
\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|
\x1B|\x1C|\x1D|\x1E|\x1F/

  class << self

    # ensure xml conformity
    def sanitize_xml(text)
      return nil if text.nil?
      text.gsub(ILLEGAL_XML_CHARS, '')
    end

    def xml_escape(text)
      sanitize_xml((text || '').gsub('<', '&lt;').gsub('>', '&gt;').gsub('&', '&amp;'))
    end

  end

end
