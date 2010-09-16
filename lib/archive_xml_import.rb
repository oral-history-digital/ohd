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
    puts "\nFull-Fledged Objects:"
    @mappings.keys.each do |type|
      puts type.to_s
    end
    super()
  end

  def start_document
    @imported = { }
    # The current object class that serves as an import context
    # for all sub-nodes
    @current_context = nil
    @current_subcontext = nil # not used right now
    # The element-to-attribute (or sub-context) mapping for said context
    @current_mapping = {}
    # The current mapping levels of the current node, in order (depth)
    @mapping_levels = []
    # The name of the current mapping levels of the current node
    @current_mapping_level = nil

    # The assocations of the current context
    @associations = []
    # Associated data to the current context
    @associated_data = {}

    # The instance being built for the current context
    @current_instance = nil
    # This is the id used by the xml source
    @source_id = nil
    # This is a mapping hash of source to local ids
    @source_to_local_id_mapping = {}
    # ??? unused
    @date_of_export = nil
  end

  def end_document
    puts "\nSource-to-Local ID-Mapping:"
    @source_to_local_id_mapping.keys.each do |type|
      puts "#{type.pluralize}: #{@source_to_local_id_mapping[type].keys.inject([]){|a,k| a << "#{k}->#{@source_to_local_id_mapping[type][k]}" }.join(', ')}"
    end
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
      # This is a base-level object type
      STDOUT.printf '.'
      STDOUT.flush
      set_context(name)
      puts "Associations: #{@associations.join(', ')}"

    elsif @associations.include?(name.to_sym)
      # somehow define a sub-context
      # TODO...
      set_subcontext(name)
      
    elsif !(@current_mapping.nil? || @current_mapping.empty?)
      # We open another mapping level for the current context
      open_mapping_level(name)
      # assign according to attribute-mapping
      @current_attribute = @current_mapping.nil? ? nil : @current_mapping[name.to_s]
    end
  end

  def end_element(name)
    if @mappings.keys.include?(name)
      # Wrap up the instance for the current context
      key_attribute = @mappings[name]['key_attribute'] || 'id'
      puts "\n#{@current_context.name} (#{key_attribute}) attributes:\n#{@attributes.inspect}"
      @instance = @current_context.send("find_or_initialize_by_#{key_attribute}", @attributes[key_attribute])
      @instance.attributes = @attributes
      puts @instance.inspect
      puts "Mapping on closing: #{@mappings[name].inspect}"
      puts "\nAssociated Data: #{@associated_data.inspect}" unless @associated_data.nil? || @associated_data.empty?
      puts
      @instance.save
      raise @instance.errors.full_messages.to_s unless @instance.valid?
      unless @source_id.nil?
        @source_to_local_id_mapping[@current_context.name.underscore] ||= {}
        @source_to_local_id_mapping[@current_context.name.underscore][@source_id] = @instance.id
      end
      save_associated_data
      @imported[@current_context.name.underscore.pluralize] ||= []
      puts "Adding instance (source id: #{@source_id}): #{@instance[key_attribute.to_sym]}"
      @imported[@current_context.name.underscore.pluralize] = @imported[@current_context.name.underscore.pluralize] << @instance[key_attribute.to_sym]
      close_context(name)

    elsif !@current_context.nil?

      # ID node: set source ID if not set already
      if name == 'id' && @mapping_levels.last == 'id' && @mapping_levels[-2] == @current_context.name.underscore
        puts "ID-Element: current_mapping: #{@current_mapping}\ncurrent context: #{@current_context.name}\nmapping levels: #{@mapping_levels.join(', ')}\nID: #{@current_data}"
        @source_id ||= @current_data.to_i
      end

      # if we have a foreign key, try to associate with an existing object
      if name =~ /[_-]id$/
        potential_parents = @associations.select{|a| a =~ name.sub(/[_-]id$/,'') }
        unless potential_parents.empty?
          parent_association = @current_context.reflect_on_association(potential_parents.first)
          unless parent_association.macro == :belongs_to
            parent = parent_association.class_name.constantize.find(@source_to_local_id_mapping[parent_association.class_name.underscore][@current_data.to_i])
            @attributes[name.sub(/[_-]id$/,'_id')] = parent.id unless parent.nil?
            puts "\n@@@@ PARENT FOUND\nfound parent object: #{parent.class.name} #{parent.id}\n"
          end
        end
      end

      # Add to the attributes for the current context or associations
      assign_data @current_data

      if @associations.include?(name.to_sym) && !@current_subcontext.nil?
        # close as sub-context
        close_subcontext(name)
      else
        # Close the current mapping level and return to
        # one level higher up.
        close_mapping_level(name)
      end

    end
  end

  def characters(text)
    @current_data << text.to_s
  end

  private

  # Initializes the state for the current context,
  # setting the current_mapping and mapping_levels.
  def set_context(klass)
    @current_context = klass.camelize.capitalize.constantize
    puts "Current Context: #{@current_context.inspect}"
    @current_subcontext = nil
    @mapping_levels = [klass]
    @current_mapping = @mappings[klass]
    @associations = @current_context.reflect_on_all_associations.map(&:name)
    @attributes = {}
    @current_attribute = nil
  end

  # Resets the state to become context-neutral.
  def close_context(klass)
    raise "Context Mismatch on closing: (current: #{@current_context.name}, called: #{klass}" unless klass.camelize.capitalize == @current_context.name
    @current_context = nil
    @current_subcontext = nil
    @mapping_levels = []
    @current_mapping = {}
    @associations = []
    @attributes = {}
    @associated_data = {}
    @source_id = nil
    @current_attribute = nil
  end

  # Initializes the state for a new associated context to
  # the main context.
  # Deal differently with has_many and belongs_to/has_one
  def set_subcontext(klass)
    unless @current_context.reflect_on_association(klass.to_sym).nil? #\
      #|| @current_context.reflect_on_association(klass).macro == :has_many
        @current_subcontext = @current_context.reflect_on_association(klass.to_sym).class_name.constantize
        puts "New Subcontext: #{@current_subcontext.inspect}"
        @associations = @current_subcontext.reflect_on_all_associations.map(&:name)
        @associated_data[@current_subcontext.name.underscore.to_sym] = \
          (@current_subcontext.name.underscore.pluralize == klass.underscore) ? [] : {}
=begin
        if @associated_data[@current_subcontext.name.underscore.to_sym].is_a?(Array)
          puts "Appending '{}' to associated_data for '#{@current_subcontext.name.underscore}'"
          @associated_data[@current_subcontext.name.underscore.to_sym] << {}
        end
=end
    end
    open_mapping_level klass
  end

  # Resets the state between associated contexts by
  # returning to the next context level higher up.
  def close_subcontext(klass)
    raise "Subcontext Mismatch on closing: (current: #{@current_subcontext.name}, called: #{klass}" unless klass.camelize.capitalize == @current_subcontext.name
    @current_subcontext = nil
    close_mapping_level klass
    puts "Closed Subcontext: #{@current_subcontext}\n#{@associated_data.inspect}"
    @associations = @current_context.reflect_on_all_associations.map(&:name) unless @current_context.nil?
    refresh_current_mapping
  end

  # assigns data to either the associated_data object (for sub-context)
  # or attributes (for context)
  def assign_data(data)
    attribute = if @current_attribute.blank?
      unless @current_mapping.is_a?(Hash)
        @current_mapping
      else
        nil
      end
    else
      @current_attribute
    end
    unless attribute.nil?
      puts "Assigning #{attribute} = #{data}"
      available_attributes = @current_subcontext.nil? ? \
        @current_context.columns.map(&:name) : @current_subcontext.columns.map(&:name)
      if available_attributes.include?(attribute)
        if @associated_data.empty?
          # write to attributes
          @attributes[attribute] = data
        elsif !@current_subcontext.nil? && !@associated_data[@current_subcontext.name.underscore.to_sym].nil?
          # write to associated data
          if @associated_data[@current_subcontext.name.underscore.to_sym].is_a?(Array)
            puts "write to array of associated data for '#{@current_subcontext.name.underscore}': #{@associated_data[@current_subcontext.name.underscore.to_sym].inspect}\n"
            if @associated_data[@current_subcontext.name.underscore.to_sym].empty?
              puts "-> array empty! appending..."
              @associated_data[@current_subcontext.name.underscore.to_sym] << { attribute => data }
            else
              puts "-> array non-empty! writing to last element: #{@associated_data[@current_subcontext.name.underscore.to_sym].last.inspect}"
              @associated_data[@current_subcontext.name.underscore.to_sym].last[attribute] = data
            end
          else
            @associated_data[@current_subcontext.name.underscore.to_sym][attribute] = data
          end
        end
      end
    end
  end

  # Opens a level of mapping, going deeper.
  def open_mapping_level(node)
    # don't open mapping levels if they don't define a mapping
    return if @mapping_levels.empty? && !@mappings.keys.include?(node)
    @mapping_levels << node

    # TODO: if we have a new tag of the existing sub-context,
    # add another associated_data element to the array
    if !@current_subcontext.nil?
      if @current_subcontext.name.underscore == node.underscore && @associated_data[@current_subcontext.name.underscore.to_sym].is_a?(Array)
        @associated_data[@current_subcontext.name.underscore.to_sym] << {}
      end
    end

    refresh_current_mapping
    unless @current_mapping.nil?
      available_attributes = @current_subcontext.nil? ? \
        @current_context.columns.map(&:name) : @current_subcontext.columns.map(&:name)
      possible_attribute = @current_mapping[node]
      if !possible_attribute.nil? && available_attributes.include?(possible_attribute)
        @current_attribute = possible_attribute
      end
      if @current_mapping.is_a?(Hash)
        puts "Current Sub-Context: #{@current_subcontext}" unless @current_subcontext.nil?
        puts "Mapping Levels: #{@mapping_levels.inspect}\n"
        puts "Current_mapping: #{@current_mapping.inspect}\n"
        puts "Current attribute: #{@current_attribute}\n" unless @current_attribute.nil?
      end
      puts
    end
  end

  # Closes the current mapping level and moves one level
  # higher up. This forces the current_mapping to be
  # reassigned.
  def close_mapping_level(node)
    @mapping_levels.pop if @mapping_levels.last == node
    @current_data = ''
    refresh_current_mapping
    unless @current_attribute.nil? || @current_subcontext.nil? || @associated_data[@current_subcontext.name.underscore.to_sym].nil?
      puts "Associated Data for #{@current_subcontext}: #{@associated_data[@current_subcontext.name.underscore.to_sym].inspect}"
    end
    @current_attribute = nil
  end

  # Reassigns the current_mapping and resets the current
  # attribute.
  def refresh_current_mapping
    # traverses the mapping hash according to the mapping levels and returns
    # the remaining sub-tree / node
    @current_mapping = @mapping_levels.inject(@mappings.dup){|m,l| m.is_a?(Hash) ? m[l] : {} }
  end

  # saves all associated data of an instance
  def save_associated_data
    unless @instance.id.nil?
      associations = @instance.class.reflect_on_all_associations
      @associated_data.keys.each do |associate|
        association = associations.select{|a| a.class_name.underscore == associate }.first
        raise "No such association: '#{associate}' for #{@instance.class.name}." if association.nil?
        if association.macro == :has_many
          @associated_data[associate].each do |object_attributes|
            # build a new instance on the association collection
            new_object = association.send("build", object_attributes)
            new_object.save
            puts "Saved (#{new_object.valid?}): #{new_object.inspect}"
            raise new_object.errors.full_messages.to_s unless new_object.valid?
          end
        else
          # build the associated object directly on the instance
          new_object = @instance.send("build_#{association.name}", @associated_data[associate])
          new_object.save
          puts "Saved (#{new_object.valid?}): #{new_object.inspect}"
          raise new_object.errors.full_messages.to_s unless new_object.valid?
        end
      end
    end
  end

end