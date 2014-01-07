namespace :xml_import do

  desc "incremental import of data"
  task :incremental, [:file, :reindex] => :environment do |task,args|
    file = args[:file] || ENV['file']
    reindex = !(args[:reindex] || ENV['reindex']).blank?
    require 'nokogiri'

    raise "No xml file supplied (file=#{file || '...'}). Please provide a valid xml filename." unless File.exists?(file.to_s)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
    @parser.parse(File.read(file))

    archive_id = (file.split('/').last[/za\d{3}/i] || '').downcase
    if reindex
      if Interview.find_by_archive_id(archive_id).nil?
        puts "Interview '#{archive_id}' wasn't imported - skipping indexing!"
      else
        # NOTE: run the reindexing separately to allow for cleanup.
        Rake::Task['solr:reindex:by_archive_id'].execute({ :ids => archive_id })
      end
    end

  end


  desc "limited import from the common repository"
  task :limited, [:number] => :environment do |task, args|
    number = (args[:number] || ENV['number'] || 25).to_i
    files_checked = 0
    imported = 0
    require 'open4'

    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    @logfile = File.join(Rails.root, 'log', "import.log")
    puts "\nLogging import from #{repo_dir} to #{@logfile}"
    File.open(@logfile,'w+') do |logfile|
      Dir.glob(File.join(repo_dir, 'za**')).each do |dir|
        xmlfile = Dir.glob(File.join(dir, 'data', 'za*.xml')).first
        next if xmlfile.blank? || imported >= number
        archive_id = xmlfile.to_s[/za\d{3}/i]
        puts "\n[#{number}]\nStarting import processes for archive id: #{archive_id}"
        files_checked += 1

        interview = Interview.find_by_archive_id(archive_id)
        statusmsg = "\n#{archive_id} [#{number-imported}] (#{Time.now.strftime('%d.%m.%y-%H:%M')}):"

        # First: XML import
        Open4::popen4("rake xml_import:incremental[#{xmlfile}] --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty? || line =~ /^config.gem/}
          unless errors.empty?
            errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            puts errmsg
          end
        end

        # post-processing - 2 subtasks
        if interview.nil? || interview.imports.last.created_at < (Time.now - 3.minutes)
          statusmsg << "skipped #{xmlfile}."
        else
          statusmsg << "import completed for #{archive_id}."
          imported += 1

          # Second: Reindexing of interview
          Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})

          statusmsg << "imported data from #{interview.imports.last.time}."
        end
        logfile << statusmsg
        puts statusmsg
        logfile.flush
        sleep 2
        puts
      end
    end
    puts "Finished importing #{imported} interviews, #{files_checked} import files processed."
  end


  desc "full import from the common repository"
  task :full => :environment do

    require 'open4'
    repo_dir = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR)
    @logfile = File.join(Rails.root, 'log', "import_#{Time.now.strftime('%d.%m.%Y.%H-%M')}.log")
    puts "\nLogging import to #{@logfile}"
    File.open(@logfile,'w+') do |logfile|
      Dir.glob(File.join(repo_dir, 'za**')).each do |dir|
        xmlfile = Dir.glob(File.join(dir, 'data', 'za*.xml')).first
        next if xmlfile.blank?
        archive_id = xmlfile.to_s[/za\d{3}/i]
        puts "\n\nStarting import processes for archive id: #{archive_id}"
        # First: XML import
        Open4::popen4("rake xml_import:incremental[#{xmlfile}] --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty? || line =~ /^config.gem/}
          unless errors.empty?
            errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            logfile << errmsg
            puts errmsg
          end
        end
        # Second: Reindexing of interview
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
    @logfile = File.join(Rails.root, 'log', "import_locations_#{Time.now.strftime('%d.%m.%Y.%H-%M')}.log")
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

end
