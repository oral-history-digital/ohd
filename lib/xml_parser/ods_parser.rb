module XMLParser

  # This Parser is a reimplementation of the ODS Import
  # to make use of the more powerful Nokogiri library,
  # and to fix the problem of interpreting the multi-column
  # ODF table cell attributes that caused a column-shift
  # under the old implementation.
  # Also, the column definition and checks have been made
  # DRYer - write configuration, not code per column.
  class ODSParser

    def initialize(file, format = :transcript)
      doc_class = case format
                    when :transcript then
                      ODSTranscript
                    when :interview_translation then
                      ODSInterviewTranslation
                    when :photo_translation then
                      ODSPhotoTranslation
                    when :camp_translation then
                      ODSCampTranslation
                    when :company_translation then
                      ODSCompanyTranslation
                    when :location_translation then
                      ODSLocationTranslation
                    when :person_translation then
                      ODSPersonTranslation
                    else
                      raise 'Invalid input format'
                  end

      # initialize the Nokogiri::XML::Document with ODS Zipfile contents
      @file = file
      @document = doc_class.new(file)
      @parser = Nokogiri::XML::SAX::Parser.new(@document)
    end

    def parse
      if @document.valid?
        @parser.parse(loadzipfile(@file))
        @document.parse_result
      else
        raise 'No parser, filename or tape/interview defined.'
      end
    end

    private

    # Extract and read the content.xml from the ODS-Zipfile contents.
    def loadzipfile(zipfile)
      require 'zip/zipfilesystem'
      Zip::ZipFile.open(zipfile) do |zipfiles|
        return zipfiles.file.read('content.xml')
      end
    end

    class ODSDocument < Nokogiri::XML::SAX::Document

      attr_reader :parse_result

      def initialize(file, options)
        @valid_file = check_file file, options[:expected_filename_parts]
        @columns = options[:columns]
        @importable_fields ||= []
        @skip_first_row = options[:skip_first_row]
        @silent = options[:silent]
        if @valid_file
          @file = file
          @filename_tokens = (File.basename(file.downcase, '.ods') || '').split('_')
          @parse_result = nil
        end
        super()
      end

      def valid?
        @valid_file
      end

      protected

      def start_document
        @count = 0
        @skipped_elements = {}
      end

      def start_element(name, attributes=[])
        case name
          when 'table:table-row'
            # start a new row
            start_row
          when 'table:table-cell'
            # adjust colspan on multiple column attribute
            colspan_attribute = attributes.find { |a| a.first == 'table:number-columns-repeated' }
            @colspan = colspan_attribute.nil? ? 1 : colspan_attribute[1].to_i
          when 'text:p', 'text:span'
            # do nothing - this is intra-column text
          else
            # add this to the skipped elements
            @skipped_elements[name] ||= 0
            @skipped_elements[name] += 1
        end
      end

      def end_element(name)
        case name
          when 'table:table-row'
            # finalize the current row
            finalize_row if @count > 0 or not @skip_first_row
            @count += 1
            if @count % 10 == 0
              print '.'
              STDOUT.flush
            end
          when 'table:table-cell'
            # finalize the previous column and initialize for
            # the following one
            finalize_column
          else
            # ignore
        end
      end

      def characters(str)
        @current_data << str unless @current_data.nil?
      end

      def end_document
        unless @silent
          # Report skipped elements
          puts "\nSkipped elements:"
          @skipped_elements.each_pair do |el, num|
            puts el.to_s + ': ' + num.to_s
          end

          puts "#{@count} rows in total. Done."
        end
      end

      # check if given file is valid
      def check_file(file, filename_parts)
        # check file exists
        unless  File.exist?(file)
          Rails.logger.debug 'XMLParser::ODSParser - File ' + file + ' not Found'
          puts 'Datei ' + file + ' konnte nicht gefunden werden!'
          return false
        end
        if File.directory?(file)
          # skip directories silently
          return false
        end
        # check file-extension
        unless File.extname(file).downcase == '.ods'
          Rails.logger.debug 'XMLParser::ODSParser - File ' + file + ' no .ods-file'
          puts 'Datei ' + file + ' keine .ods-Datei!'
          return false
        end
        # check file-name structure
        unless File.split(file)[1].split('_').size == filename_parts
          Rails.logger.debug 'XMLParser::ODSParser - File ' + file + ' filename structure failed'
          puts 'Datei ' + file + ' Dateistruktur fehlerhaft!'
          return false
        end
        true
      end

      def start_row
        @current_data = ''
        @data = []
        @attributes = {}
      end

      def finalize_row
        # match the data with the table layout...
        columns = @columns.dup
        next_column = columns.shift
        @data.each_with_index do |text, index|
          break if next_column.nil?
          column_type = next_column.keys.first

          # Skip data columns until the column matches the expected pattern.
          match = if next_column[column_type].nil?
                    true # nil always matches
                  elsif next_column[column_type].is_a?(Regexp)
                    text =~ next_column[column_type]
                  elsif next_column[column_type].is_a?(Integer)
                    index == next_column[column_type]
                  end
          if match
            if @importable_fields.include?(column_type)
              # If data matches a regexp then we assume that data is
              # sane, otherwise we remove invalid characters.
              @attributes[column_type] = next_column[column_type].is_a?(Regexp) ? text : XMLParser::sanitize_xml(text).gsub("\\", '/')
            end
            next_column = columns.shift
          end
        end
      end

      def finalize_column
        (@colspan || 1).times do
          @data << @current_data
        end
        @colspan = 1
        @current_data = ''
      end

    end

    class ODSTranscript < ODSParser::ODSDocument

      # these are the fields that are copied from a new-imported version
      # into an existing segment
      TRANSCRIPT_FIELDS = [:timecode, :transcript, :translation]

      def initialize(file)
        options = {
            :expected_filename_parts => 5,
            :columns => [
                {:timecode => /^\d{2}:\d{2}:\d{2}[:.,]{1}\d{2}$/},
                {:transcript => nil},
                {:translation => nil}
            ],
            :skip_first_row => false
        }
        super(file, options)

        if @valid_file
          archive_id = @filename_tokens.first
          @interview = Interview.find_by_archive_id(archive_id)
          raise "No interview found for '#{archive_id}'" if @interview.blank?

          @importable_fields = TRANSCRIPT_FIELDS

          tape_media_id = "#{@filename_tokens[0]}_#{@filename_tokens[1]}_#{@filename_tokens[2]}".upcase
          @tape = Tape.find_or_initialize_by_media_id(tape_media_id) do |tape|
            tape.interview_id = @interview.id
            tape.filename = @file.split('/').last
          end
          raise @tape.errors.full_messages.join('; ') + '.' unless @tape.valid?

          @tape.reset_interview_speaker_checklist_item!
          @tape.save
          raise @tape.errors.full_messages.join('; ') + '.' if @tape.new_record? || !@tape.valid?

          # Mark this interview as prepared for research
          # (conditionally - see interview.rb for details)
          @interview.prepare!

          @segments_found = 0
          @segments_saved = 0

          @previous_timecode = nil
        end
      end

      def valid?
        super and not (@interview.nil? or @tape.nil?)
      end

      protected

      def end_document
        super
        finalize_tape
        puts "#{@segments_saved} Segmente von #{@segments_found} gefundenen importiert."
        @parse_result = [@segments_found, @segments_saved, @tape.segments.size]
      end

      def finalize_row
        super
        finalize_segment
      end

      private

      # Writes the current segment with the new data to the DB.
      def finalize_segment
        unless @attributes[:timecode].blank?
          # match the segment by timecode
          @timecode = Timecode.new(@attributes.delete(:timecode)).timecode
          if !@previous_timecode.nil? && @timecode <= @previous_timecode
            raise "Timecode '#{@timecode}' does not follow the previous timecode '#{@previous_timecode}'"
          end
          segment = Segment.find_or_initialize_by_tape_id_and_timecode(@tape.id, @timecode)
          @segments_found += 1

          # update new segment
          segment.skip_strict_validation!
          segment.attributes =
              @attributes.merge :version_comments => 'Datenabgleich per ODS',
                                :interview_id => @interview.id,
                                :tape_id => @tape.id,
                                :media_id => "#{@tape.media_id}_%04i" % @segments_found

          # save new segment
          if segment.new_record? || segment.changed?
            puts "Saving changes: #{segment.changes.inspect}"
            segment.save
            raise "INVALID SEGMENT for '#{@timecode}': #{segment.errors.full_messages}" unless segment.valid?
            @segments_saved += 1
          end

          @previous_timecode = @timecode
        end
      end

      # Updates the tape duration and performs post-parsing processing.
      def finalize_tape
        @tape.duration = @timecode
        @tape.save
        @tape.reload # load new segments
        puts "Tape '#{@tape.media_id}' duration set to #{@timecode}"
      end
    end

    # A generic base class for interview translation files.
    class ODSTranslation < ODSParser::ODSDocument

      def initialize(file, import_class, columns)
        @import_class = import_class
        options = {
            :expected_filename_parts => 4,
            :columns => columns,
            :skip_first_row => true,
            :silent => true
        }
        super(file, options)
        @importable_fields = options[:columns].map { |column| column.each_key.first }
        @interview_id = @filename_tokens.first[2..4].to_i
        @parse_result = {
            :locale => @filename_tokens.last.to_sym,
            :interview_id => @interview_id,
            entities_name => {}
        }
      end

      protected

      def finalize_row
        super

        # Identify object by ID.
        obj_id = @attributes.delete("#{entity_name}_id".to_sym).to_i
        unless obj_id.blank? or obj_id == 0
          unless @import_class.count(:conditions => {:id => obj_id, :interview_id => @interview_id}) == 1
            raise "File '#{File.expand_path(@file)}' references #{entity_name} ID #{obj_id} which cannot be found in the database."
          end

          unless @parse_result[entities_name][obj_id].nil?
            raise "File '#{File.expand_path(@file)}' contains duplicate #{entity_name} ID #{obj_id}."
          end
          @parse_result[entities_name][obj_id] = @attributes.dup
        end
      end

      private

      def entity_name
        @import_class.name.underscore.to_sym
      end

      def entities_name
        @import_class.name.underscore.pluralize.to_sym
      end

    end

    class ODSInterviewTranslation < ODSParser::ODSTranslation
      def initialize(file)
        columns = [
            {:segment_id => 0},
            {:mainheading => 5},
            {:subheading => 7},
            {:annotation1 => 9},
            {:annotation2 => 11}
        ]
        super(file, Segment, columns)
      end
    end

    class ODSPhotoTranslation < ODSParser::ODSTranslation
      def initialize(file)
        columns = [
            {:photo_id => 0},
            {:caption => 3}
        ]
        super(file, Photo, columns)
      end
    end

    class ODSCampTranslation < ODSParser::ODSDocument

      def initialize(file)
        options = {
            :expected_filename_parts => 3,
            :columns => [
                {:camp_id => 0},
                {:descriptor => 1},
                {:locale => 2}
            ],
            :skip_first_row => true,
            :silent => true
        }
        super(file, options)
        @importable_fields = options[:columns].map { |column| column.each_key.first }
        @parse_result = {
            :locale => @filename_tokens.last.to_sym,
            :camps => {}
        }
      end

      protected

      def finalize_row
        super

        locale = @attributes[:locale]
        return if locale.blank? or locale.to_sym != @parse_result[:locale]

        obj_id = @attributes[:camp_id].to_i
        if obj_id.blank? or obj_id == 0
          raise "File '#{File.expand_path(@file)}' contains a translation without camp ID."
        end
        unless Camp.exists?(obj_id)
          print "File '#{File.expand_path(@file)}' references camp ID #{obj_id} which cannot be found in the database."
          @skip_next = true
        end
        unless @parse_result[:camps][obj_id].nil?
          raise "File '#{File.expand_path(@file)}' contains duplicate camp ID #{obj_id}."
        end
        if @attributes[:descriptor].blank?
          raise "File '#{File.expand_path(@file)}' contains a blank translation for camp ID #{obj_id}."
        end

        if @skip_next
          @skip_next = false
          return
        end
        @parse_result[:camps][obj_id] = @attributes[:descriptor]
      end

    end

    class ODSCompanyTranslation < ODSParser::ODSDocument

      def initialize(file)
        options = {
            :expected_filename_parts => 3,
            :columns => [
                {:company_id => 0},
                {:company_name_id => 1},
                {:descriptor => 2},
                {:locale => 3}
            ],
            :skip_first_row => true,
            :silent => true
        }
        super(file, options)
        @importable_fields = options[:columns].map { |column| column.each_key.first }
        @parse_result = {
            :locale => @filename_tokens.last.to_sym,
            :companies => {}
        }
      end

      protected

      def finalize_row
        super

        locale = @attributes[:locale]
        return if locale.blank? or locale.to_sym != @parse_result[:locale]

        obj_id = @attributes[:company_id].to_i
        if obj_id.blank? or obj_id == 0
          raise "File '#{File.expand_path(@file)}' contains a translation without company ID."
        end
        unless Company.exists?(obj_id)
          print "File '#{File.expand_path(@file)}' references company ID #{obj_id} which cannot be found in the database."
          @skip_next = true
        end
        unless @parse_result[:companies][obj_id].nil?
          raise "File '#{File.expand_path(@file)}' contains duplicate company ID #{obj_id}."
        end
        if @attributes[:descriptor].blank?
          raise "File '#{File.expand_path(@file)}' contains a blank translation for company ID #{obj_id}."
        end

        if @skip_next
          @skip_next = false
          return
        end
        @parse_result[:companies][obj_id] = {
            :company_name_id => @attributes[:company_name_id].to_i,
            :descriptor => @attributes[:descriptor]
        }
      end

    end

    class ODSLocationTranslation < ODSParser::ODSDocument

      def initialize(file)
        options = {
            :expected_filename_parts => 4,
            :columns => [
                {:location_name_id => 1},
                {:descriptor => 3},
                {:locale => 4},
                {:name_type => 5}
            ],
            :skip_first_row => true,
            :silent => true
        }
        super(file, options)
        @importable_fields = options[:columns].map { |column| column.each_key.first }
        @parse_result = {
            :locale => @filename_tokens.last.to_sym,
            :locations => {}
        }
      end

      protected

      def finalize_row
        super

        locale = @attributes[:locale]
        return if locale.blank? or not [@parse_result[:locale], :de].include? locale.to_sym
        locale = locale.to_sym

        return if locale == :de and @attributes[:name_type] != 'StdName'

        name_id = @attributes[:location_name_id].to_i
        if locale == :de
          unless @std_location_name_id.nil?
            raise "File '#{File.expand_path(@file)}' contains an untranslated standard name #{@std_location_name_id}."
          end
          if name_id.blank? or name_id == 0
            raise "File '#{File.expand_path(@file)}' contains a standard name without location name ID."
          end
          # Deal with location names that have been deleted while the translation took place.
          unless LocationName.exists?(name_id)
            print "File '#{File.expand_path(@file)}' references location name ID #{name_id} which cannot be found in the database."
            @skip_next = true
          end
          @std_location_name_id = name_id
          return
        end

        if @std_location_name_id.nil?
          raise "File '#{File.expand_path(@file)}' contains a translated location name ID '#{@name_id}' - '#{@attributes[:descriptor]}' without a standard name or a duplicate translation."
        end
        unless @parse_result[:locations][@std_location_name_id].nil?
          # Deal with duplicate physical locations...
          if name_id == @parse_result[:locations][@std_location_name_id][:location_name_id] and
              @attributes[:descriptor] == @parse_result[:locations][@std_location_name_id][:descriptor]
            @std_location_name_id = nil
            return
          end
          raise "File '#{File.expand_path(@file)}' contains a duplicate standard location name ID #{@std_location_name_id}."
        end
        if @attributes[:descriptor].blank?
          raise "File '#{File.expand_path(@file)}' contains a blank translation for standard location name ID #{@std_location_name_id}."
        end

        if @skip_next
          @std_location_name_id = nil
          @skip_next = false
          return
        end

        @parse_result[:locations][@std_location_name_id] = {
            :location_name_id => name_id,
            :descriptor => @attributes[:descriptor]
        }
        @std_location_name_id = nil
      end

    end

    class ODSPersonTranslation < ODSParser::ODSDocument

      def initialize(file)
        options = {
            :expected_filename_parts => 4,
            :columns => [
                {:name => 0},
                {:locale => 1},
                {:name_type => 2}
            ],
            :skip_first_row => true,
            :silent => true
        }
        super(file, options)
        @importable_fields = options[:columns].map { |column| column.each_key.first }
        @parse_result = {
            :type => "#{@filename_tokens.second.capitalize}Name".constantize,
            :locale => @filename_tokens.last.to_sym,
            :people => {}
        }
      end

      protected

      def finalize_row
        super

        locale = @attributes[:locale]
        return if locale.blank? or not [@parse_result[:locale], :de].include? locale.to_sym
        locale = locale.to_sym

        return if locale == :de and @attributes[:name_type] != 'StdName'

        name = @attributes[:name]
        if locale == :de
          unless @german_name.nil?
            raise "File '#{File.expand_path(@file)}' contains an untranslated German name #{@german_name}."
          end
          if name.blank?
            raise "File '#{File.expand_path(@file)}' contains an empty German name."
          end
          @german_name = name
          return
        end

        if @german_name.nil?
          raise "File '#{File.expand_path(@file)}' contains a duplicate translation '#{name}' or the corresponding German name is missing."
        end
        unless @parse_result[:people][@german_name].nil?
          # Deal with duplicate names...
          if name == @parse_result[:people][@german_name]
            @german_name = nil
            return
          end
          raise "File '#{File.expand_path(@file)}' contains a duplicate German name '#{@german_name}'."
        end
        if @attributes[:name].blank?
          raise "File '#{File.expand_path(@file)}' contains a blank translation for the German name '#{@german_name}'."
        end

        @parse_result[:people][@german_name] = @attributes[:name]
        @german_name = nil
      end

    end

  end

end
