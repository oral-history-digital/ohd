require 'nokogiri'

# XML parser that just reads the quality and adjust an interview's
# inferior_quality flag accordingly, without a reimport.

class QualityXMLImport < Nokogiri::XML::SAX::Document

  def initialize(filename)
    @archive_id = (filename.split('/').last[/za\d{3}/i] || '').downcase
    raise "Invalid XML file name for import: #{filename}\nCannot map to archive_id. Aborting." if @archive_id.blank?
    @interview = Interview.find_or_initialize_by_archive_id(@archive_id)
    if @interview.nil? || @interview.imports.last.nil?
      puts "Interview '#{@archive_id}' not imported in archive, skipping."
      exit
    end
    @import_threshold = @interview.imports.last.time - 30.days
    super()
  end

  def start_document

  end

  def start_element(name, attributes={})
    if name == 'export'
      attributes = node_attributes_to_hash(attributes)
      if(Time.zone.parse(attributes['created-at']) < @import_threshold)
        # set the inferior quality flag
        @interview.inferior_quality = (attributes['quality'].strip.first.to_i < 2)
      end
    end
  end

  def end_document
    if @interview.inferior_quality_changed?
      puts "Setting #{@interview.archive_id} to inferior_quality = #{@interview.inferior_quality} now."
      @interview.save
    end
  end

  # creates a hash from the different formats of Nokogiri attribute
  # arrays: flat and 2D.
  def node_attributes_to_hash(attr)
    attr.flatten!
    attr_hash = {}
    while(attr.size > 0) && (attr.size % 2 == 0)
      k = attr.shift
      v = attr.shift
      attr_hash[k] = v
    end
    attr_hash
  end


end