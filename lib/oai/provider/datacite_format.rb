require 'oai'
module OAI::Provider::Metadata

  class Datacite < Format
    def initialize
      @prefix = 'oai_datacite'
      @schema = 'http://datacite.org/schema/kernel-4'
      @namespace = 'http://www.w3.org/2001/XMLSchema-instance'
      @element_namespace = 'datacite'
      #@fields = [ :title, :creator, :subject, :description, :publisher,                                                                                                       
            #:contributor, :date, :type, :format, :identifier,                                                                                                           
            #:source, :language, :relation, :coverage, :rights]
    end

    def header_specification
      {
        xmlns: "http://datacite.org/schema/kernel-4",
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
        'xsi:schemaLocation': %{
          http://datacite.org/schema/kernel-4    
          https://schema.datacite.org/meta/kernel-4.6/metadata.xsd
        }.gsub(/\s+/, ' ')
      }
    end

  end

end
