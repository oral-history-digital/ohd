require 'nokogiri'
require 'globalize'

# Optional Mapping Definitions:
#
# class_name: class to be instantiated rather than the node name
#
# key_attributes:
#  - Set to "none" when updates of existing records are not allowed, e.g. in combination with "delete_all" (see below).
#  - Set to the unique primary or alternate key to be used with find_or_initialize (format: "attribute[|attribute[...]]").
#    NB: It is not necessary to include "interview_id" to the unique key as this attribute will be implicitly added.
#
# delete_all: call a delete_all on has_many associations before evaluating an array-type node
#
# skip_invalid: do not cause an error on invalid objects, just skip them

class ArchiveXMLImport < Nokogiri::XML::SAX::Document

  MAPPING_FILE = File.join(Rails.root, 'config/xml_import_mappings.yml')

  SANITY_CHECKS = %w(export xml-schema created-at current-migration agreement published)

  # A few entities need to waive the checks so we can interpret agreement & published values
  ENTITIES_WAIVING_CHECKS = %w(collection language interview person)

  def initialize(filename, selective=false)
    # Check whether we load a selection of contexts only.
    @selection = selective ? selective.split(/[,;\s]/).map{|s| [s.pluralize, s.singularize]}.flatten : []
    unless @selection.empty?
      puts "\nRestricting import to '#{@selection.join(", ")}'.\n"
    end

    # Load XML-to-model mapping meta data.
    @mappings = File.exists?(MAPPING_FILE) ? YAML::load_file(MAPPING_FILE) : {}

    # Load the interview to be imported.
    @archive_id = (filename.split('/').last[/za\d{3}/i] || '').downcase
    raise "Invalid XML file name for import: #{filename}\nCannot map to archive_id. Aborting." if @archive_id.blank?
    @interview = Interview.find_or_initialize_by_archive_id(@archive_id)

    # Prepare sanity checking.
    self.import_sanity_levels = SANITY_CHECKS

    super()
  end

  def start_document
    # Variables used to version imports.

    # To check whether we already imported a file.
    @date_of_export = nil
    # migration to store in imports table
    @migration = nil


    # Variables used for attribute assignment...

    # The current object class that serves as an import context
    # for all sub-nodes
    @current_context = nil
    # Sub-Typing of context...
    @current_node_name = nil
    # The element-to-attribute mapping for said context
    @current_mapping = {}
    # The mapping levels of the current node, in order (depth)
    @mapping_levels = []
    # The attribute hash of the current context.
    @attributes = {}
    # The currently active locale.
    @current_locale = I18n.default_locale
    # Whether the currently parsed attribute is translated.
    @translated_attribute = false
    # The text content of the current node (usually an attribute value) in the current locale.
    @current_data = ''
    # Flag whether we are still parsing.
    @parsing = true
    # Flag used to exclude nodes not within the context selection.
    @parse_within_selection = false


    # Variables used for reporting...

    # Import statistics.
    @imported = { 'interviews' => [] }

    # Progress and reporting.
    @last_main_node = ''
    @node_index = 0

    # Report source-to-target (platform-to-archive) ID assignment.
    @source_id = nil
    @source_to_local_id_mapping = {}

    # Store skipped (=unassignable) tag names to avoid duplicate reporting of errors.
    @skipped_tag_names = []
  end

  def end_document
    if @parsing
      begin
        @interview.save! and puts "Stored interview '#{@interview.to_s}' (#{@interview.archive_id})."
        @interview.set_forced_labor_locations!
        @interview.set_return_locations!
        @interview.set_deportation_location!
        @interview.set_contributor_fields!
        @imported['interviews'] << @interview.archive_id
        if @selection.empty?
          # only create an import instance on full imports
          import = @interview.imports.create{|imp| imp.migration = @migration.strip; imp.time = @date_of_export; imp.content = @imported }
          puts "Finished import for #{@interview.archive_id}: #{import.inspect}"
        end
      rescue => e
        msg = [e.message]
        unless e.backtrace.blank?
          msg = msg + [ e.backtrace ]
        end
        unless @interview.errors.empty?
          msg = msg + ["Interview Errors: "] + @interview.errors.full_messages
        end
        raise "\nERROR: #{msg.flatten.join("\n")}\n'#{@archive_id}': #{@interview.inspect}\nAborted."
      end
      puts "\nSkipped tag elements:\n#{@skipped_tag_names.join(", ")}"
      puts "\nSource-to-Local ID-Mapping:"
      @source_to_local_id_mapping.keys.each do |type|
        puts "#{type.pluralize}: #{@source_to_local_id_mapping[type].keys.inject([]){|a,k| a << "#{k}->#{@source_to_local_id_mapping[type][k]}" }.join(', ')}"
      end
    else
      puts "\nStopped parsing."
    end
    puts "\nImported: #{@imported.empty? ? 'nothing' : ''}"
    @imported.keys.each do |context|
      puts context.to_s + ':'
      @imported[context].compact!
      if (@imported[context].size > 12) && @imported[context].first.to_i + @imported[context].size - 1 == @imported[context].last.to_i
        puts "[#{@imported[context].first}...#{@imported[context].last}]"
      else
        puts @imported[context].compact.inspect
      end
      puts
    end
    puts
  end

  def start_element(name, node_attributes={})
    if SANITY_CHECKS.include?(name)

      # Perform pre-node sanity check.
      case name

        when 'export'
          node_attributes = node_attributes_to_hash(node_attributes)
          includes_all_mandatory_attributes = true
          %w(archive-id created-at quality).each do |attr|
            includes_all_mandatory_attributes = false unless node_attributes.keys.include?(attr)
          end
          if includes_all_mandatory_attributes
            increment_import_sanity 'xml-schema'
          end
          export_archive_id = node_attributes['archive-id']
          if export_archive_id != @archive_id
            report_sanity_check_failure_for 'export', "Mismatch of archive_ids: File-based=#{@archive_id}, based on XML attribute=#{export_archive_id}. Aborting."
          else
            increment_import_sanity name
          end

          sanity_check = 'created-at'
          export_date_attr = node_attributes[sanity_check]
          if export_date_attr.nil? || export_date_attr.empty? || export_date_attr.last.blank?
            report_sanity_check_failure_for sanity_check, "Export creation date missing in XML."
          else
            @date_of_export = ActiveRecord::ConnectionAdapters::Column.string_to_time(export_date_attr)
            if @date_of_export <= @interview.import_time
              report_sanity_check_failure_for sanity_check, "Interview #{@interview.to_s} has an existing import which is just as recent or more than '#{@date_of_export.strftime('%d.%m.%Y')}'."
            else
              increment_import_sanity sanity_check
            end
          end

          # set the inferior quality flag
          @interview.inferior_quality = (node_attributes['quality'].strip.first.to_i < 2)

        else
          # These are post-node sanity checks that will be handled when closing the node.

      end

    elsif !(parsing?(name) && passes_import_sanity_checks(name))
      # Skip this element if not parsing.
      return

    elsif @mapping_levels.empty?

      if name != name.singularize and @mappings.keys.include?(name.singularize)
        # Start a collection node.
        if @last_main_node != name.singularize
          STDOUT.printf "\n#{name}"; STDOUT.flush
          @last_main_node = name.singularize
        end
        # check to see if we need to clear all associated items first
        item_mapping = @mappings[name.singularize]
        if item_mapping.is_a?(Hash) and item_mapping['delete_all']
          # send the association a delete_all!
          klass = (item_mapping['class_name'] || name.singularize).camelize.constantize
          if klass.column_names.include?('interview_id') && !@interview.new_record?
            # We use Klass.delete_all() to delete records as it's much more efficient than destroy_all().
            # NB: this does not respect :dependent => :delete/:destroy configuration so we have
            # to manually delete dependent translations to avoid orphans.
            if klass.translates?
              ids = klass.all(:select => :id, :conditions => { :interview_id => @interview.id }).map(&:id).map(&:to_i)
              num_deleted_records = klass.translation_class.delete_all("#{klass.table_name.singularize}_id" => ids)
              STDOUT.printf " (deleted #{num_deleted_records} #{klass.name} translations.)"
            end
            num_deleted_records = klass.delete_all(:interview_id => @interview.id)
            STDOUT.printf " (deleted #{num_deleted_records} #{klass.name.pluralize})"
            STDOUT.flush
          end
        end

      elsif @mappings.keys.include?(name)
        # Start an instance node.
        if @last_main_node != name
          STDOUT.printf "\n#{name}"; STDOUT.flush
          @last_main_node = name
        end
        set_context(name)

      else
        # Start unmapped collection, instance or attribute.

      end

    elsif @current_attribute.nil?
      # Start an attribute node.
      open_mapping_level(name)
      set_current_attribute(name)

    else
      # Start a locale node.
      raise "Found invalid locale '#{name}' in import data." unless I18n.available_locales.include? name.to_sym
      @current_locale = name.to_sym
      @translated_attribute = true

    end
  end

  def end_element(name)
    @current_data.strip!
    if SANITY_CHECKS.include?(name)
      return unless sanity_check_passes?(name)

    elsif not parsing?(name)
      # do nothing

    elsif not @current_context.nil?

      if @current_node_name == name
        # Close instance node.
        finalize_instance(name) unless attributes.empty?
        close_context(name)

      elsif @mapping_levels.last == name
        # Close attribute node.
        finalize_attribute(name)
        close_mapping_level(name)

      else
        # Close locale node.
        raise "Found invalid locale '#{name}' in import data." unless I18n.available_locales.include? name.to_sym

        # Assign a localized attribute value in the current context.
        assign_attribute(@current_attribute, @current_data) unless @current_attribute.nil?
        @current_data = ''

      end

    else
      # Close unmapped instance or attribute node.

    end

  end

  def characters(text)
    @current_data << text.to_s unless @current_context.nil?
  end

  def passes_import_sanity_checks(name = nil)
    if @sanity_checks.empty?
      true
    else
      unless name.nil?
        return true unless (@mappings.keys - ENTITIES_WAIVING_CHECKS).include?(name)
      end
      unless defined?(@reported_failed_sanity_checks)
        puts "\nERROR - FAILED SANITY CHECKS (on #{name}):"
        puts @sanity_checks.keys.map{|k| k.to_s + ': ' + @sanity_checks[k].to_s}.join("\n")
        @reported_failed_sanity_checks = true
        @parsing = false
      end
      false
    end
  end

  private

  # implement a check for selective imports
  def parsing?(name)
    selection_toggle = case @selection
                         when []
                           true
                         when Array
                           @selection.include?(name) || @selection.include?(@current_context)
                       end
    @parse_within_selection = true if selection_toggle
    @parsing && @parse_within_selection
  end

  # Initializes the state for the current context,
  # setting the current_mapping and mapping_levels.
  def set_context(klass)
    @current_node_name = klass
    @mapping_levels = [klass]
    @current_mapping = @mappings[klass]
    begin
      @current_context = klass.camelize.constantize
    rescue NameError
      # Not an Error: the mapping does not correspond 1:1 to an object class
      if @current_mapping['class_name'].nil?
        unless @skipped_tag_names.include?(klass.to_sym)
          puts "ERROR: Could not associate tag name '#{klass}' directly with an object class and no class_name definition is given. Skipping!"
          @skipped_tag_names << klass.to_sym
        end
        return
      else
        # Associate the class_name argument with the current_context
        @current_context = @current_mapping['class_name'].camelize.constantize
      end
    end
    reset_attributes_for(@current_context.name)
    @current_attribute = nil
  end

  # Resets the state to become context-neutral.
  def close_context(klass)
    raise "Context Mismatch on closing: (current: #{@current_context.name}, called: #{klass}" unless klass == @current_node_name
    reset_attributes_for(@current_context.name)
    @parse_within_selection = false if @selection.include?(@current_context.name)
    @current_context = nil
    @current_node_name = nil
    @mapping_levels = []
    @current_mapping = {}
    @source_id = nil
    @current_attribute = nil
    @current_data = ''
  end

  # Opens a level of mapping, going deeper.
  def open_mapping_level(node)
    # don't open mapping levels if they don't define a mapping
    return if @mapping_levels.empty? && !@mappings.keys.include?(node)
    @mapping_levels << node
    refresh_current_mapping
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
    @current_locale = I18n.default_locale
    @translated_attribute = false
    refresh_current_mapping
    @current_attribute = nil
  end

  # Reassigns the current_mapping and resets the current
  # attribute.
  def refresh_current_mapping
    # traverses the mapping hash according to the mapping levels and returns
    # the remaining sub-tree / node
    @current_mapping = @mapping_levels.inject(@mappings.dup){|m,l| m.is_a?(Hash) ? m[l] : {} }
  end

  def assign_attribute(name, value)
    @attributes[@current_context.name] ||= {}
    @attributes[@current_context.name][name.to_sym] ||= {}
    @attributes[@current_context.name][name.to_sym][@current_locale] = value.is_a?(String) ? value.strip : value
  end

  def attributes
    @attributes[@current_context.name] ||= {}
  end

  def finalize_attribute(name)
    # ID node: set source ID if not set already
    if name == 'id' && @mapping_levels.last == 'id' && @mapping_levels[-2] == @current_context.name.underscore
      @source_id ||= @current_data.to_i
    end

    # Add to the attributes for the current context.
    assign_attribute(@current_attribute, @current_data) unless @current_attribute.nil? || @translated_attribute
  end

  def finalize_instance(name)

    case @current_context.name
      when 'Interview'

        # Assign the attributes to the interview but don't save yet.
        raise "Archive-ID mismatch:\nFile: #{@archive_id}\nData: #{attributes[:archive_id][I18n.default_locale]}" unless attributes[:archive_id][I18n.default_locale] == @archive_id
        current_instance = @interview
        assign_attributes_to_instance(current_instance)

      else

        key_attribute_hash = {}
        key_attributes = %w(none nil).include?(@mappings[name]['key_attributes']) ? [] : (@mappings[name]['key_attributes'] || 'id').split('|').map(&:to_sym)
        key_attributes.each do |key_attribute|
          key_attribute_hash[key_attribute.to_s] = if attributes[key_attribute].nil?
                                                     nil
                                                   else
                                                     raise 'Expected all key attributes to be available in default locale.' if attributes[key_attribute][I18n.default_locale].nil?
                                                     attributes[key_attribute][I18n.default_locale]
                                                   end
        end

        belongs_to_interview = @current_context.column_names.include?('interview_id')
        current_instance = if key_attribute_hash.empty?
                             # We are in "insert-only" mode and may therefore not update existing records.
                             if belongs_to_interview
                               @current_context.new :interview_id => @interview.id
                             else
                               @current_context.new
                             end
                           else
                             # We update existing records if we find one by the (alternate) key.
                             if belongs_to_interview
                               key_attribute_hash['interview_id'] = @interview.id
                             end
                             dynamic_finder_name = 'find_or_initialize_by_' + key_attribute_hash.keys.sort.join('_and_')
                             dynamic_finder_params = key_attribute_hash.keys.sort.map { |att| key_attribute_hash[att] }
                             @current_context.send(dynamic_finder_name, *dynamic_finder_params)
                           end

        # Progression feedback.
        if (@node_index += 1) % 15 == 12
          STDOUT.printf '.'; STDOUT.flush
        end

        assign_attributes_to_instance(current_instance)

        begin
          current_instance.save!

          # Link the interview to the current instance if the
          # interview belongs to the current instance (e.g. a collection).
          if @interview.respond_to?("#{name}_id=")
            @interview.send("#{name}_id=", current_instance.id)
          end

        rescue ActiveRecord::RecordInvalid

          # Produce validation messages including all associations.
          errors = [ current_instance.inspect, current_instance.errors.full_messages.to_s ]
          associations = current_instance.class.reflect_on_all_associations.select { |assoc| assoc.macro == :belongs_to && assoc.name != :interview }
          associations.each do |assoc|
            associated_instance = current_instance.send(assoc.name.to_s)
            unless associated_instance.nil? || associated_instance.errors.empty?
              errors << associated_instance.errors.full_messages.to_s
              errors << associated_instance.inspect
            end
          end

          message = "ERROR on #{current_instance.class.name}:\n#{errors.join("\n")}"

          if @current_mapping['skip_invalid']
            puts "\n\n#{message}"
          else
            raise message
          end
        end

        # Remember the instance type and ID for import statistics.
        unless current_instance.new_record?
          instance_id = if key_attributes.empty?
                          current_instance.id
                        else
                          key_attributes.map { |att| current_instance[att] }.join('|')
                        end
          @imported[@current_context.name.underscore.pluralize] ||= []
          @imported[@current_context.name.underscore.pluralize] << instance_id
        end

    end

    unless @source_id.nil?
      @source_to_local_id_mapping[@current_context.name.underscore] ||= {}
      @source_to_local_id_mapping[@current_context.name.underscore][@source_id] = current_instance.id
    end

  end

  # handle assignment to content_columns and setter methods
  def assign_attributes_to_instance(instance)
    db_columns = instance.class.content_columns.map{|c| c.name }
    attributes.select{|k,v| !db_columns.include?(k.to_s)}.each do |attr, locales|
      locales.each do |locale, value|
        if instance.class.translates?
          instance.class.with_locale(locale) do
            instance.send("#{attr}=", value) if instance.respond_to?("#{attr}=")
          end
        else
          raise "Unexpected locale '#{locale}' for non-translated attribute '#{attr}'." if locale != I18n.default_locale
          instance.send("#{attr}=", value) if instance.respond_to?("#{attr}=")
        end
      end
      @attributes[@current_context.name].delete(attr)
    end
    attributes_by_locale = {}
    attributes.each do |attr, locales|
      locales.each do |locale, value|
        attributes_by_locale[locale] ||= {}
        attributes_by_locale[locale][attr] = value
      end
    end
    attributes_by_locale.each do |locale, attrs|
      if instance.class.translates?
        instance.class.with_locale(locale) do
          instance.attributes = attrs
        end
      else
        raise "Unexpected locale '#{locale}' for non-translated object: #{attrs.inspect}." if locale != I18n.default_locale
        instance.attributes = attrs
      end
    end
  end

  def reset_attributes_for(klass)
    @attributes[klass] = {}
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

  # Do post-node sanity checks.
  def sanity_check_passes?(name)

    case name
      when 'current-migration'
        import_migration = Import.current_migration.strip
        if import_migration != @current_data.strip
          if import_migration > @current_data.strip
            puts "Importing data from an older migration than '#{import_migration}': #{@current_data}."
          else
            puts "Importing data from a new migration '#{@current_data}'."
          end
        end
        @migration = @current_data
        increment_import_sanity name

      when 'agreement'
        if @current_data.strip == 'true'
          puts "Agreement condition: satisfied."
          increment_import_sanity name
        else
          puts "Does not satisfy agreement conditions - stopping import!"
          @parsing = false
          return false
        end

      when 'published'
        return false if @current_context.nil?
        if @current_data.strip == 'true'
          puts "Publish condition: satisfied."
          increment_import_sanity name
        else
          puts "Does not satisfy publish condition (#{@current_data}) - stopping import!"
          @parsing = false
          return false
        end

      when 'quality'
        @interview.quality = @current_data.strip.to_f

      else
        # These are pre-node sanity checks that have already been handled.

    end
    @current_data = ''
    true
  end

  # Import Sanity - set a precondition for a successful save
  # Each sanity level must be cleared before a successful validation
  # or the corresponding message is added to the errors.
  def import_sanity_levels=(levels)
    @sanity_checks = {}
    set_sanity_level = lambda{|level, msg| @sanity_checks[level.to_s.underscore.to_sym] = msg}
    case levels
      when Array
        levels.each do |level|
          set_sanity_level.call(level, import_sanity_message_for(level))
        end
      when Hash
        levels.each_pair do |level, message|
          set_sanity_level.call(level, message)
        end
      when String, Symbol
        set_sanity_level.call(level, import_sanity_message_for(name))
    end
  end

  def increment_import_sanity(name)
    name = name.to_s.underscore.to_sym
    if @sanity_checks.keys.include?(name)
      @sanity_checks.delete(name)
    end
  end

  def report_sanity_check_failure_for(name, message)
    name = name.to_s.underscore.to_sym
    if @sanity_checks.keys.include?(name)
      @sanity_checks[name] = message
    end
  end

  def import_sanity_message_for(name)
    "Did not pass sanity check for #{name} (missing info in XML?)."
  end

end
