require 'nokogiri'

class ArchiveXMLImport < Nokogiri::XML::SAX::Document

  # Chars to remove before Indexing/Importing
  ILLEGAL_XML_CHARS = /\x00|\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|
\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|
\x1B|\x1C|\x1D|\x1E|\x1F/

  MAPPING_FILE = File.join(RAILS_ROOT, 'config/xml_import_mappings.yml')

  def initialize(incremental=true)
    @incremental = !(incremental.nil? || incremental == false)
    @mappings = File.exists?(MAPPING_FILE) ? YAML::load_file(MAPPING_FILE) : {}
    super()
  end

  def start_document
    @imported = { }
    # The current object class that serves as an import context
    # for all sub-nodes
    @current_context = nil
    @current_sub_context = nil
    # The element-to-attribute mapping for said context
    @current_mapping = {}
    # The current mapping level
    @mapping_levels = []
    @current_mapping_level = nil
    @associations = []
    @current_instance = nil
    @date_of_export = nil
  end

  def end_document
    puts "\nImported:"
    @imported.keys.each do |context|
      puts context.to_s + ':'
      puts @imported[context].inspect
      puts
    end
  end

  def start_element(name, attributes={})
    @current_data = ''
    if @mappings.keys.include?(name)
      STDOUT.printf '.'
      STDOUT.flush
      set_context(name)
    elsif @associations.include?(name.to_sym)
      # somehow define a sub-context
      # TODO...
    elsif !(@current_mapping.nil? || @current_mapping.empty?)
      open_mapping_level(name)
      # assign according to attribute-mapping
      @current_attribute = @current_mapping.nil? ? nil : @current_mapping[name.to_s]
    end
  end

  def end_element(name)
    if @mappings.keys.include?(name)
      # add the attributes now and create
      key_attribute = @current_mapping['key_attribute'] || 'id'
      @instance = @current_context.send("find_or_initialize_by_#{key_attribute}", @attributes[key_attribute])
      @instance.attributes = @attributes
      puts "\n#{@current_context.name} attributes:\n#{@attributes.inspect}"
      puts @instance.inspect
      puts
      #@instance.save!
      @imported[@current_context.name.underscore.pluralize] ||= []
      @imported[@current_context.name.underscore.pluralize] = @imported[@current_context.name.underscore.pluralize] << @instance[@current_mapping['key_attribute'] || :id]
      close_context(name)
    elsif @associations.include?(name.to_sym)
      # TODO: create the association and close the sub-context
    elsif !@current_context.nil?
      if @current_attribute.blank?
        unless @current_mapping.blank? || !@current_context.columns.map(&:name).include?(@current_mapping)
          @attributes[@current_mapping] = @current_data
        end
        # write the mapping value:
      else
        # write the attribute
        @attributes[@current_attribute] = @current_data
      end
      close_mapping_level(name)
    end
  end

  def characters(text)
    @current_data << text.to_s
  end

  private

  def set_context(klass)
    @current_context = klass.camelize.capitalize.constantize
    puts "Current Context: #{@current_context.inspect}"
    @current_sub_context = nil
    @mapping_levels = [klass]
    @current_mapping = @mappings[klass]
    @associations = @current_context.reflect_on_all_associations.map(&:name)
    @attributes = {}
    @associated
    @current_attribute = nil
  end

  def close_context(klass)
    raise "Context Mismatch on closing: (current: #{@current_context.name}, called: #{klass}" unless klass.camelize.capitalize == @current_context.name
    @current_context = nil
    @current_sub_context = nil
    @mapping_levels = []
    @current_mapping = {}
    @associations = []
    @attributes = {}
    @current_attribute = nil
  end

  def open_mapping_level(node)
    # don't open mapping levels if they don't define a mapping
    return if @mapping_levels.empty? && !@mappings.keys.include?(node)
    @mapping_levels << node
    refresh_current_mapping
    puts "Mapping Levels: #{@mapping_levels.inspect}\n"
    puts "Current_mapping: #{@current_mapping}\n"
    puts "Current attribute: #{@current_attribute}\n"
  end

  def close_mapping_level(node)
    @mapping_levels.pop if @mapping_levels.last == node
    @current_data = ''
    refresh_current_mapping
  end

  def refresh_current_mapping
    @current_mapping = @mapping_levels.inject(@mappings.dup){|m,l| m.is_a?(Hash) ? m[l] : {} }
    @current_attribute = nil
  end

end