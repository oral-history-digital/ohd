namespace :import do

  desc "Import interview data"
  task :all => :environment do

    require 'hpricot'

    xml_file = ENV['file']
    raise "no xml file provided (file= ), aborting." if xml_file.nil?
    puts "xml file = #{xml_file}"

    puts "Removing data..."

    Collection.delete_all
    #TODO: dependencies
    Interview.delete_all
    Category.delete_all
    Categorization.delete_all
    Photo.delete_all
    Tape.delete_all
    Segment.delete_all

    puts "Importing Archive interview data..."

    doc = open(xml_file) { |f| Hpricot.XML(f) }

    puts "Adding Collections data..."
    
    collection_ids = {}
    (doc/:collection).each do |collection|
      platform_collection = Collection.create :name => (collection/'title').inner_html

      %w(countries homepage institution interviewers responsibles notes project_id).each do |f|
        platform_collection.update_attribute f, (collection/f.gsub('_', '-')).inner_html
      end

      collection_ids[(collection/'id').inner_html] = platform_collection.id
    end

    # parsing interviews
    (doc/:interview).each do |interview|

      archive_id = (interview/'archive-id').inner_html

      if (interview/'ready-to-publish').inner_html == 'true' and (interview/'agreement').inner_html == 'true'
        puts "Adding #{archive_id}"

        # interview collection
        platform_collection_id = collection_ids[(interview/'collection-id').inner_html]
        platform_interview = Interview.create :archive_id => archive_id,
                                              :collection_id => platform_collection_id

        # interview data
        attributes = {}
        %w(full_title duration video translated).each do |f|
          attributes[f] = (interview/f.gsub('_', '-')).inner_html
        end
        platform_interview.update_attributes attributes

        # personal data
        attributes = {}
        %w(gender date_of_birth country_of_origin details_of_origin deportation_date deportation_location forced_labor_details punishment liberation_date).each do |f|
          attributes[f] = (interview/:person/f.gsub('_', '-')).inner_html
        end
        platform_interview.update_attributes attributes
        
        platform_interview.update_attributes :first_name => (interview/:person/'firstname').inner_html,
                                             :last_name => (interview/:person/'firstname').inner_html,
                                             :other_first_names => (interview/:person/'middle-names').inner_html

        # categorized data
        categories = {'language-name' => 'Sprache',
                      'forced-labor-group-names' => 'Gruppen',
                      'forced-labor-field-names' => 'Einsatzbereiche',
                      'forced-labor-habitation-names' => 'Unterbringung'
        }

        #TODO: use always "|" to split in export file
        categories.each do |export_field, category_type|
          names = category_type == "Sprache" ? ((interview/export_field).inner_html) : ((interview/:person/export_field).inner_html)
          names.split((category_type == "Sprache") ? '/' : '|').each do |name|
            category_type_object = Category.find_by_name_and_category_type name, category_type
            category_type_object ||= Category.create :name => name,
                                                     :category_type => category_type

            categorization = Categorization.create :category_type => category_type,
                                                   :interview_id => platform_interview.id,
                                                   :category_id => category_type_object.id
          end
          
        end

        # editors
        platform_interview.update_attributes :segmented => (interview/'workflow-state-for-segmentation').inner_html == 'completed' ? 1 : 0,
                                             :researched => (interview/'workflow-state-for-research').inner_html == 'completed' ? 1 : 0

        editors = {}
        (interview/'interview-team-member').each do |member|
          task = (member/'task').inner_html
          if (task == 'segmentation' and !platform_interview.segmented) or (task == 'research' and !platform_interview.researched)            
            name = nil
          else
            name = "#{(member/'first-name').inner_html} #{(member/'last-name').inner_html}"
            if editors.include? task
              editors[task] << ", #{name}"
            else
              editors[task] = name
            end
          end
        end

        platform_interview.update_attributes :interviewers => (editors['interview'] || nil),
                                             :transcriptors => (editors['transcript'] || nil),
                                             :translators => (editors['translation'] || nil),
                                             :researchers => (editors['research'] || nil),
                                             :segmentators => (editors['segmentators'] || nil)


        # tapes and segments
        if platform_interview.segmented
          # insert segments
        else
          # remove segments
        end
      else
        puts "Skipping #{archive_id}: not ready to publish or no agreement"
      end
    end

  end


  desc "imports segments from captions xml data"
  task :segments, [:file] => :environment do |task, args|
    file = args[:file]
    raise "No file= argument supplied. Aborting." if file.nil?
    raise "No such file '#{file}'. Aborting." unless File.exists?(file)

    require 'nokogiri'

    parser = Nokogiri::XML::SAX::Parser.new(CaptionsSegments.new)
    parser.parse_file(file)
    
  end

  desc "imports all captions xml files in the directory"
  task :all_segments, [:dir] => :environment do |task,args|
    dir = args[:dir]
    raise "No dir= argument given. Aborting." if dir.nil?
    raise "No such directory '#{dir}'. Aborting." unless File.directory?(dir)

    require "open4"

    @logger = ScriptLogger.new('segment_xml_import')

    Dir.glob(File.join(dir, '**', 'captions_za*.xml')).each do |filename|

      @logger.log "Importing captions xml from #{filename}."

      Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && rake import:segments file=#{filename} --trace") do |pid, stdin, stdout, stderr|
        stdout.each_line {|line| @logger.log line }
        errors = []
        stderr.each_line {|line| errors << line unless line.empty?}
        @logger.log "\nImport der Transkriptionen - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
      end

    end

    Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && rake data:segment_duration --trace") do |pid, stdin, stdout, stderr|
      stdout.each_line {|line| @logger.log line }
      errors = []
      stderr.each_line {|line| errors << line unless line.empty?}
      @logger.log "\nRecalculating Segment Duration - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
    end

    Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && rake solr:reindex:all --trace") do |pid, stdin, stdout, stderr|
      stdout.each_line {|line| @logger.log line }
      errors = []
      stderr.each_line {|line| errors << line unless line.empty?}
      @logger.log "\nRecalculating Segment Duration - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
    end
    

  end

end