namespace :xml_import do

  desc "incremental import of data"
  task :incremental, [:file, :reindex] => :environment do |task,args|
    file = args[:file] || ENV['file']
    reindex = !args[:reindex].blank?
    require 'nokogiri'

    raise "No xml file supplied (file=#{file || '...'}). Please provide a valid xml filename." unless File.exists?(file.to_s)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
    @parser.parse(File.read(file))

    archive_id = (file.split('/').last[/za\d{3}/i] || '').downcase
    if reindex
      unless Interview.find_by_archive_id(archive_id).nil?
        # puts "Beginning import of '#{archive_id}'"
        # Don't run this as it can corrupt the index for all
        # interviews that are not up-to-date
        # Rake::Task['cleanup:unused_categories'].execute
        # NOTE: run the reindexing separately to allow for cleanup
        Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})
      else
        puts "Interview '#{archive_id}' wasn't imported - skipping indexing!"
      end
    end

  end

  desc "full import from the common repository"
  task :full => :environment do

    require 'open4'
    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    @logfile = File.join(RAILS_ROOT, 'log', "import_#{Time.now.strftime('%d.%m.%Y.%H-%M')}.log")
    puts "\nLogging import to #{@logfile}"
    File.open(@logfile,'w+') do |logfile|
      Dir.glob(File.join(repo_dir, 'za**')).each do |dir|
        xmlfile = Dir.glob(File.join(dir, 'data', 'za*.xml')).first
        next if xmlfile.blank?
        archive_id = xmlfile.to_s[/za\d{3}/i]
        puts "\n\nStarting import processes for archive id: #{archive_id}"
        # First: XML import
        Open4::popen4("rake xml_import:incremental file=#{xmlfile} --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty? || line =~ /^config.gem/}
          unless errors.empty?
            errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            logfile << errmsg
            puts errmsg
          end
        end
        # Second: XML language cleanup/import
        Open4::popen4("rake xml_import:languages id=#{archive_id} --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty? || line =~ /^config.gem/}
          unless errors.empty?
            errmsg = "\nImport der Sprachdaten für Interview (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            logfile << errmsg
            puts errmsg
          end
        end
        # Third: Reindexing of interview
        Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})
        statusmsg = "finished import of #{xmlfile.to_s[/za\d{3}/i]}. Pausing for 2 seconds.\n"
        logfile << statusmsg
        puts statusmsg
        sleep 2
        puts
      end
    end

    # delete empty location references
    Open4::popen4("rake cleanup:remove_empty_locations --trace") do |pid, stdin, stdout, stderr|
      stdout.each_line {|line| puts line }
      errors = []
      stderr.each_line {|line| errors << line unless line.empty? || line =~ /^config.gem/}
      unless errors.empty?
        errmsg = "\nFEHLER:\n#{errors.join("\n")}"
        @logfile << errmsg
        puts errmsg
      end
    end

  end


  desc "location references import from xml data"
  task :locations, [:file] => :environment do |task,args|
    file = args[:file] || ARGV[0]
    require 'nokogiri'

    raise "No xml file supplied (file=...). Please provide a valid xml filename." unless File.exists?(file)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file, true, 'location,locations-segment'))
    @parser.parse(File.read(file))

  end

  desc "selective location references import for all interviews"
  task :all_locations => :environment do
    require 'open4'
    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    @logfile = File.join(RAILS_ROOT, 'log', "import_locations_#{Time.now.strftime('%d.%m.%Y.%H-%M')}.log")
    puts "\nLogging import to #{@logfile}"
    File.open(@logfile,'w+') do |logfile|
      Dir.glob(File.join(repo_dir, 'za**')).each do |dir|
        xmlfile = Dir.glob(File.join(dir, 'data', 'za*.xml')).first
        next if xmlfile.blank?
        Open4::popen4("rake xml_import:locations file=#{xmlfile} --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty?}
          unless errors.empty?
            errmsg = "\nImport der Ortsdaten aus (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            logfile << errmsg
            puts errmsg
          end
        end
        statusmsg = "finished locations import of #{xmlfile.to_s[/za\d{3}/i]}. Pausing for 2 seconds.\n"
        logfile << statusmsg
        puts statusmsg
        sleep 2
        puts
      end
    end
  end


  desc "checks and assigns interview languages in case there are problems during xml import"
  task :languages, [:id] => :environment do |task,args|
    require 'nokogiri'

    id = args[:id]

    puts "\nChecking and updating languages for #{id.blank? ? 'all interviews' : id}:"
    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    if id.blank?
      # all interviews
      repo_dir = File.join(repo_dir, 'za**')
    else
      # specific interview
      repo_dir = File.join(repo_dir, id.downcase)
    end
    Dir.glob(File.join(repo_dir, 'data', 'za*.xml')).each do |xmlfile|
      archive_id = (xmlfile.split('/').last[/za\d{3}/i] || '').downcase
      next if archive_id.blank?
      puts archive_id
      @parser = Nokogiri::XML::SAX::Parser.new(LanguageXMLImport.new(xmlfile))
      @parser.parse(File.read(xmlfile))
      puts
    end

  end


  desc "checks and updates text_materials for an interview"
  task :text_materials, [:id] => :environment do |task,args|
    require 'nokogiri'

    id = args[:id]

    puts "\nChecking and updating text_materials for #{id.blank? ? 'all interviews' : id}:"
    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    if id.blank?
      # all interviews
      repo_dir = File.join(repo_dir, 'za**')
    else
      # specific interview
      repo_dir = File.join(repo_dir, id.downcase)
    end
    Dir.glob(File.join(repo_dir, 'data', 'za*.xml')).each do |xmlfile|
      archive_id = (xmlfile.split('/').last[/za\d{3}/i] || '').downcase
      next if archive_id.blank?
      puts archive_id
      @parser = Nokogiri::XML::SAX::Parser.new(TextMaterialXMLImport.new(xmlfile))
      @parser.parse(File.read(xmlfile))
      puts
    end

  end

end
