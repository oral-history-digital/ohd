require 'nokogiri'

class ArchiveXMLImport < Nokogiri::XML::SAX::Document

  # Chars to remove before Indexing/Importing
  ILLEGAL_XML_CHARS = /\x00|\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|
\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|
\x1B|\x1C|\x1D|\x1E|\x1F/

  MAPPING_FILE = File.join(RAILS_ROOT, 'config/xml_import_mappings.yml')

  def initialize(filename, incremental=true)
    @incremental = !(incremental.nil? || incremental == false)
    @mappings = File.exists?(MAPPING_FILE) ? YAML::load_file(MAPPING_FILE) : {}
    puts "\nFull-Fledged Objects:"
    @mappings.keys.each do |type|
      puts type.to_s
    end
    @archive_id = (filename.split('/').last[/za\d{3}/i] || '').downcase
    raise "Invalid XML file name for import: #{filename}\nCannot map to archive_id. Aborting." if @archive_id.blank?
    @interview = Interview.find_or_initialize_by_archive_id(@archive_id)
    @@interview_associations = Interview.reflect_on_all_associations.map{|assoc| [ assoc.name, assoc.macro ]}
    super()
  end

  def start_document
    @imported = { }
    # The current object class that serves as an import context
    # for all sub-nodes
    @current_context = nil
    # Sub-Typing of context...
    @current_context_type = nil
    @current_node_name = nil
    @current_subcontext = nil # not used right now
    # The element-to-attribute (or sub-context) mapping for said context
    @current_mapping = {}
    # The current mapping levels of the current node, in order (depth)
    @mapping_levels = []
    # The name of the current mapping levels of the current node
    @current_mapping_level = nil

    @last_node = ''

    @current_data = ''

    # store skipped tag names here to avoid duplicate reporting of errors
    @skipped_tag_names = []

    # The assocations of the current context
    @associations = {}
    # Associated data to the current context
    @associated_data = {}

    @attributes = {}

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
    puts "\n\n@@@attributes inspection:\n#{@attributes.inspect}\n\n"
    begin
      @interview.save! and puts "Stored interview '#{@interview.to_s}' (#{@interview.archive_id})."
      @imported['interviews'] << @interview.archive_id
    rescue
      puts "\nERROR: #{@interview.errors.full_messages.join("\n")}\n"
      puts "Interview '#{@archive_id}': #{@interview.inspect}\n\n"
      raise "Aborted."
    end
    puts "\nSkipped tag elements:\n#{@skipped_tag_names.join(", ")}"
    puts "\nSource-to-Local ID-Mapping:"
    @source_to_local_id_mapping.keys.each do |type|
      puts "#{type.pluralize}: #{@source_to_local_id_mapping[type].keys.inject([]){|a,k| a << "#{k}->#{@source_to_local_id_mapping[type][k]}" }.join(', ')}"
    end
    puts "\nImported:"
    @imported.keys.each do |context|
      puts context.to_s + ':'
      puts @imported[context].compact.inspect
      puts
    end
  end

  def start_element(name, attributes={})
    # @current_data = ''
    # puts "\n####> CURRENT MAPPING: #{@mapping_levels.join(' | ')}"
    if @mapping_levels.empty?
      if @mappings.keys.include?(name)
        # This is a base-level object type
        #STDOUT.printf '.'
        #STDOUT.flush
        set_context(name)
        #puts "Associations: #{@associations.keys.join(', ')}"

        # check to see if we need to clear all associated items first
        if @current_mapping.keys.include?(@current_tag_name.to_s.singularize)
          key_attribute = @current_mapping[@current_tag_name.to_s.singularize]['key_attribute']
          if !key_attribute.nil? && %w(nil none).include?(key_attribute)
            # send the association a delete_all!
          end
        end

      elsif @associations.keys.include?(name.to_sym)
        # somehow define a sub-context
        set_subcontext(name)

      else
        # We open another mapping level for the current context
        open_mapping_level(name)
        # assign according to attribute-mapping
        set_current_attribute(name)
      end
    else
      # We open another mapping level for the current context
      open_mapping_level(name)
      # assign according to attribute-mapping
      set_current_attribute(name)
    end
  end

  def end_element(name)
    if !@current_context.nil? && @current_node_name == name && !attributes.empty?
      # Wrap up the instance for the current context
      key_attribute = %w(none nil).include?(@mappings[name]['key_attribute']) ? nil : (@mappings[name]['key_attribute'] || 'id').to_sym
      puts "\n#{@current_context.name} (#{key_attribute.nil? ? 'no key_attribute' : attributes[key_attribute]}) attributes:\n#{attributes.inspect}"
      @type_scope = {}
      if @current_mapping.keys.include?('class_type')
        type_field = @current_mapping['type_field']  || 'type'
        @type_scope[type_field] = @current_mapping['class_type']
      end
      case @current_context.name
        when 'Interview'
          # simply assign the attributes to the interview
          raise "Archive-ID mismatch:\nFile: #{@archive_id}\nData: #{attributes[:archive_id]}" unless attributes[:archive_id] == @archive_id
          assign_attributes_to_instance(@interview)
        else
          @instance = if key_attribute.nil?
                        @current_context.new
                      elsif @type_scope.empty?
                        @current_context.send("find_or_initialize_by_#{key_attribute}", attributes[key_attribute])
                      else
                        type_field = @type_scope.keys.first
                        @current_context.send("find_or_initialize_by_#{key_attribute}_and_#{type_field}", attributes[key_attribute], @type_scope[type_field])
                      end
          if @instance.new_record?
            puts "\n=> Creating a new #{@current_context.name} for #{key_attribute} '#{attributes[key_attribute]}'."
          else
            puts "\n-> Updating existing #{@current_context.name} [#{@instance.id}] for #{key_attribute} '#{attributes[key_attribute]}'."
          end
          assign_attributes_to_instance(@instance)

          # assign to interview association based on context_name
          association = @@interview_associations.assoc(@current_context.name.underscore.pluralize.to_sym) || @@interview_associations.assoc(@current_context.name.underscore.to_sym)
          # assign to interview association based on tag name
          association ||= @@interview_associations.assoc(name.to_sym) || @@interview_associations.assoc(name.to_s.singularize.to_sym) || @@interview_associations.assoc(name.to_s.pluralize.to_sym)

          unless association.nil?
            @interview.save if @interview.new_record?
            [@interview, @instance].each do |item|
              unless item.valid?
                puts "\nERROR: #{item.class.name} '#{item}' invalid:\n#{item.inspect}\n\nError Messages:\n#{item.errors.full_messages.join("\n")}\n"
              end
            end
            case association.last
              when :has_many
                $instance = @instance
                @interview.instance_eval { eval "#{association.first.to_s} << $instance unless #{association.first.to_s}.include?($instance)" }
              when :belongs_to
                @instance.save
                @interview.send("#{association.first}_id=", @instance.id)
              else
                if @instance.new_record?
                  @instance = @interview.instance_eval { eval "build_#{association.first.to_s}" }
                  assign_attributes_to_instance(@instance)
                else
                  $instance = @instance
                  @interview.instance_eval { eval "#{association.first.to_s} = $instance" }
                end
            end
          end
          @instance.save
          raise @instance.errors.full_messages.to_s unless (@instance.valid? || @current_mapping['skip_invalid'])
      end

      unless @source_id.nil?
        @source_to_local_id_mapping[@current_context.name.underscore] ||= {}
        @source_to_local_id_mapping[@current_context.name.underscore][@source_id] = @instance.id
      end
      save_associated_data
      @imported[@current_context.name.underscore.pluralize] ||= []
      puts "Adding instance (source id: #{@source_id}): #{!key_attribute.nil? ? @instance[key_attribute.to_sym] : @instance.to_s}"
      @imported[@current_context.name.underscore.pluralize] = @imported[@current_context.name.underscore.pluralize] << (key_attribute.nil? ? @instance.id : @instance[key_attribute.to_sym])
      close_context(name)

    elsif !@current_context.nil?

      # TODO: this seems broken - there are a number of sub-contexts which need to be
      # ignored currently. Also there's a lot of assumptions going into this mapping_levels[-2] thing...

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
            assign_attribute(name.sub(/[_-]id$/,'_id'), parent.id) unless parent.nil?
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
    @current_data = ''
  end

  def characters(text)
    @current_data << text.to_s
  end

  private

  # Initializes the state for the current context,
  # setting the current_mapping and mapping_levels.
  def set_context(klass)
    @current_node_name = klass
    @current_subcontext = nil
    @mapping_levels = [klass]
    @current_mapping = @mappings[klass]
    begin
      @current_context = klass.camelize.constantize
    rescue NameError
      puts
      if @current_mapping['class_name'].nil?
        unless @skipped_tag_names.include?(klass.to_sym)
          puts "ERROR: Could not associate tag name '#{klass}' directly with an object class and no class_name definition is given. Skipping!"
          @skipped_tag_names << klass.to_sym
        end
        return
      else
        # puts "Could not associate tag name '#{klass}' directly with an object class... trying to interpret class_name definition (#{@current_mapping['class_name']})."
        @current_context = @current_mapping['class_name'].camelize.constantize
      end
    end
    puts "Current Context: #{@current_context.to_s}#{@current_node_name != @current_context.to_s.underscore ? " as Node #{@current_node_name}'" : ''}"
    @associations = {}
    @current_context.reflect_on_all_associations.each do |assoc|
      @associations[assoc.name] = assoc.name
    end
    if @current_mapping['associated_models'].is_a?(Hash)
      @current_mapping['associated_models'].each do |expected,name|
        @associations[expected.to_sym] = name.to_sym
      end
    end
    #puts "\n@@@ ASSOCIATION MAPPING FOR: #{@current_context.to_s}\n#{@associations.inspect}\n@@@\n\n"
    reset_attributes_for(@current_context.name)
    @current_attribute = nil
  end

  # Resets the state to become context-neutral.
  def close_context(klass)
    puts "Attributes for #{@current_context.name}:\n#{attributes.inspect}\n"
    raise "Context Mismatch on closing: (current: #{@current_context.name}, called: #{klass}" unless klass == @current_node_name
    reset_attributes_for(@current_context.name)
    @current_context = nil
    @current_node_name = nil
    @current_subcontext = nil
    @mapping_levels = []
    @current_mapping = {}
    @associations = {}
    @associated_data = {}
    @source_id = nil
    @current_attribute = nil
  end

  # Initializes the state for a new associated context to
  # the main context.
  # Deal differently with has_many and belongs_to/has_one
  def set_subcontext(klass)
    associated_class = @associations[(klass || 'none').to_sym]
   # puts "\n\n@@@ TRYING TO SET SUB-CONTEXT: #{klass} as '#{associated_class}' on #{@current_context}\n@@@\n\n"
    unless @current_context.reflect_on_association(associated_class).nil? #\
      #|| @current_context.reflect_on_association(klass).macro == :has_many
        @current_subcontext = @current_context.reflect_on_association(associated_class)
        puts "New Subcontext: #{@current_subcontext.name}"
        @associations = {}
        @current_subcontext.class_name.constantize.reflect_on_all_associations.each do |assoc|
          @associations[assoc.name] = assoc.name
        end
        @associated_data[@current_subcontext.name] = \
          (@current_subcontext.name.to_s.pluralize == klass.underscore) ? [] : {}
    end
    @associated_tag = klass
    open_mapping_level klass
    #puts "Sub-Context mapping (current_mapping levels): #{@mapping_levels.join(" >> ")}"
  end

  # Resets the state between associated contexts by
  # returning to the next context level higher up.
  def close_subcontext(klass)
    raise "Subcontext Mismatch on closing: (current: #{@current_subcontext.name}, called: #{klass}" unless klass == @associated_tag
    @current_subcontext = nil
    close_mapping_level klass
    #puts "Closed Subcontext: #{@current_subcontext.name}\n#{@associated_data.inspect}"
    unless @current_context.nil?
      @associations = {}
      @current_context.reflect_on_all_associations.each do |assoc|
        @associations[assoc.name] = assoc.name
      end
    end
    refresh_current_mapping
  end

  # assigns data to either the associated_data object (for sub-context)
  # or attributes (for context)
  def assign_data(data)
    unless @current_attribute.nil?
      # puts "\n==> Assigning #{attribute} = #{data}"
      #if data.to_s.strip == 'Auschwitz'
      #  puts "\n=====> Data assignment (#{@current_context.to_s}): #{@current_attribute}"
      #  puts "Assigning attribute: '#{@current_attribute}'"
      #  puts "Current Mapping: #{@current_mapping.inspect}\n"
      #end
      if @associated_data.empty?
        # write to attributes
        assign_attribute(@current_attribute, data)
      elsif !@current_subcontext.nil? && !@associated_data[@current_subcontext.name].nil?
        # write to associated data
        if @associated_data[@current_subcontext.name].is_a?(Array)
          #puts "write to array of associated data for '#{@current_subcontext.name}': #{@associated_data[@current_subcontext.name].inspect}\n"
          if @associated_data[@current_subcontext.name].empty?
            #puts "-> array empty! appending..."
            @associated_data[@current_subcontext.name] << { @current_attribute => data }
          else
            #puts "-> array non-empty! writing to last element: #{@associated_data[@current_subcontext.name].last.inspect}"
            @associated_data[@current_subcontext.name].last[@current_attribute] = data
          end
        else
          @associated_data[@current_subcontext.name][@current_attribute] = data
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
      if @current_subcontext.name.to_s.singularize == node.underscore.singularize && @associated_data[@current_subcontext.name].is_a?(Array)
        @associated_data[@current_subcontext.name] << {}
        puts "\n@@@ New #{@current_subcontext.name.to_s.upcase} associated instance added."
      end
    end

    refresh_current_mapping
    unless @current_mapping.nil?
      if @current_mapping.is_a?(Hash) &&!@last_node.eql?(node)
        puts "\n_____CONTEXT____:"
        puts "Current Sub-Context: #{@current_subcontext.name}" unless @current_subcontext.nil?
        puts "Mapping Levels: #{@mapping_levels.inspect}\n"
        puts "Current_mapping: #{@current_mapping.inspect}\n"
        puts "Current attribute: #{@current_attribute}\n" unless @current_attribute.nil?
        puts "Attributes on mapping level:\n#{attributes.inspect}"
      end
      #puts
    end
  end


  def set_current_attribute(name)
    # assign according to attribute-mapping
    @current_attribute = case @current_mapping
                           when nil
                            nil
                           when String
                            @current_mapping
                           when Hash
                            @current_mapping[name.to_s]
                         end
  end

  # Closes the current mapping level and moves one level
  # higher up. This forces the current_mapping to be
  # reassigned.
  def close_mapping_level(node)
    @mapping_levels.pop if @mapping_levels.last == node
    @current_data = ''
    refresh_current_mapping
    unless @current_attribute.nil? || @current_subcontext.nil? || @associated_data[@current_subcontext.name].nil?
      #puts "Associated Data for #{@current_subcontext.name}: #{@associated_data[@current_subcontext.name].inspect}"
    end
    @current_attribute = nil
    unless @last_node == node
      # puts "Closing: #{node}\n"
    end
    @last_node = node
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
      @associated_data.keys.each do |name|
        matching_associations = associations.select{|assoc| assoc.name == name}
        raise "No such association: '#{name}' for #{@instance.class.name}." if matching_associations.empty?
        association = matching_associations.first
        if association.macro == :has_many
          @associated_data[association.name].each do |object_attributes|
            next if object_attributes.blank? || object_attributes.empty?
            # build a new instance on the association collection
            new_object = @instance.send(association.name).send("build", object_attributes)
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

  def attributes
    @attributes[@current_context.name] ||= {}
  end

  def assign_attribute(name, value)
    @attributes[@current_context.name] ||= {}
    @attributes[@current_context.name][name.to_sym] = value.is_a?(String) ? value.strip : value
  end

  # handle assignment to content_columns and setter methods
  def assign_attributes_to_instance(instance)
    db_columns = instance.class.content_columns.map{|c| c.name }
    attributes.select{|k,v| !db_columns.include?(k.to_s)}.each do |attr,value|
      instance.send("#{attr}=", value) if instance.respond_to?("#{attr}=")
      @attributes[@current_context.name].delete(attr)
    end
    instance.attributes = attributes
  end

  def reset_attributes_for(klass)
    @attributes[klass] = {}
    # puts "\nData reset for '#{klass}'"
  end

end