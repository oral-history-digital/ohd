require 'nokogiri'

class LanguageXMLImport < Nokogiri::XML::SAX::Document

  def initialize(filename)
    @archive_id = (filename.split('/').last[/za\d{3}/i] || '').downcase
    raise "Invalid XML file name for import: #{filename}\nCannot map to archive_id. Aborting." if @archive_id.blank?
    @interview = Interview.find_or_initialize_by_archive_id(@archive_id)
    if @interview.nil?
      puts "Interview '#{@archive_id}' not imported in archive, skipping."
      exit
    end
    @current_language = nil
    @parsing_language = false
    @current_data = ''
    @current_element = nil
    @languages_for_interview = []
    super()
  end

  def start_document

  end

  def start_element(name, attributes={})
    if name == 'language'
      @parsing_language = true
    end
    @current_element = name if @parsing_language
  end

  def characters(text)
    @current_data << text.to_s unless @current_element.nil?
  end

  def end_element(name)
    if @parsing_language && %w(language languages).include?(name)
      @parsing_language = false
    end
    if @parsing_language && name == 'name'
      @current_data.strip.split('/').each do |lang|
        @current_language = Category.find(:first, :conditions => ["name = ? and category_type = 'Sprache'", lang])
        if @current_language.nil?
          puts "No language '#{lang}' found! Skipping."
        else
          @interview.languages << @current_language unless @interview.languages.include?(@current_language)
          @languages_for_interview << @current_language.name
        end
      end
    end
    @current_language = nil unless @parsing_language
    @current_data = ''
    @current_element = nil
  end

  def end_document
    puts "Found languages for interview (#{@languages_for_interview.size}): #{@languages_for_interview.join(', ')}"
    @interview.save
    puts "Saved interview. Done."
  end


end