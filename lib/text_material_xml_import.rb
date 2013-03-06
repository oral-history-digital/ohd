require 'nokogiri'

class TextMaterialXMLImport < Nokogiri::XML::SAX::Document

  def initialize(filename)
    @archive_id = (filename.split('/').last[/za\d{3}/i] || '').downcase
    raise "Invalid XML file name for import: #{filename}\nCannot map to archive_id. Aborting." if @archive_id.blank?
    @interview = Interview.find_or_initialize_by_archive_id(@archive_id)
    if @interview.nil?
      puts "Interview '#{@archive_id}' not imported in archive, skipping."
      exit
    end
    @current_document = nil
    @document_properties = {}
    @parsing_document = false
    @current_data = ''
    @current_element = nil
    @materials_for_interview = []
    super()
  end

  def start_document

  end

  def start_element(name, attributes={})
    if name == 'text-material'
      @parsing_document = true
    end
    @current_element = name if @parsing_document
  end

  def characters(text)
    @current_data << text.to_s unless @current_element.nil?
  end

  def end_element(name)
    if @parsing_document && %w(text-material text-materials).include?(name)
      unless @document_properties[:type].blank?
        # retrieve or create the document
        @current_document = @interview.text_materials.select{|tm| tm.document_type == @document_properties[:type] }.first
        @current_document ||= @interview.text_materials.build{|tm| tm.document_type = @document_properties[:type] }
        puts "Importing document for #{@document_properties[:filename]}"
        begin
          @current_document.document_file_name = @document_properties[:filename]
          if @current_document.new_record?
            puts "CREATED new text_material #{@current_document.document_file_name} for #{@interview}"
          else
            puts "UPDATED text_material #{@current_document.document_file_name} for #{@interview}"
          end
          @interview.save
          if @current_document.save
            @materials_for_interview << @current_document.document_file_name
          else
            puts "VALIDATION ERROR for: #{@current_document.inspect}\n\nERROR MESSAGE: #{@current_document.errors.full_messages}"
          end
        rescue Exception => e
          puts "ERROR: #{e.message}\nSkipping #{@document_properties[:filename]}!"
        end
      end
      @parsing_language = false
      @document_properties = {}
    end
    if @parsing_document
      case name
        when 'document-type'
          @document_properties[:type] = @current_data.strip

        when 'document-file-name'
          @document_properties[:filename] = @current_data.strip
          
      end
    else
      @current_document = nil
      @document_properties = {}
      @current_element = nil
    end
    @current_data = ''
  end

  def end_document
    puts "Found documents for interview (#{@materials_for_interview.size}): #{@materials_for_interview.join(', ')}"
    @interview.save
    puts "Saved interview. Done."
  end
  
end