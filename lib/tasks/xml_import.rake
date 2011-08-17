namespace :xml_import do

  desc "incremental import of data"
  task :incremental, [:file] => :environment do |task,args|
    file = args[:file]
    require 'nokogiri'

    raise "No xml file supplied (file=#{file || '...'}). Please provide a valid xml filename." unless File.exists?(file)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
    @parser.parse(File.read(file))

    archive_id = (file.split('/').last[/za\d{3}/i] || '').downcase
    unless Interview.find_by_archive_id(archive_id).nil?
      puts "Beginning import of '#{archive_id}'"
      # Don't run this as it can corrupt the index for all
      # interviews that are not up-to-date
      # Rake::Task['cleanup:unused_categories'].execute
      Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})
    else
      puts "Interview '#{archive_id}' wasn't imported - skipping indexing!"
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
        Open4::popen4("rake xml_import:incremental file=#{xmlfile} --trace") do |pid, stdin, stdout, stderr|
          stdout.each_line {|line| puts line }
          errors = []
          stderr.each_line {|line| errors << line unless line.empty?}
          unless errors.empty?
            errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}"
            logfile << errmsg
            puts errmsg
          end
        end
        statusmsg = "finished import of #{xmlfile.to_s[/za\d{3}/i]}. Pausing for 6 seconds.\n"
        logfile << statusmsg
        puts statusmsg
        sleep 6
        puts
      end
    end

  end


  desc "location references import from xml data"
  task :locations, [:file] => :environment do |task,args|
    file = args[:file] || ARGV[0]
    require 'nokogiri'

    raise "No xml file supplied (file=...). Please provide a valid xml filename." unless File.exists?(file)

    @parser = Nokogiri::XML::SAX::Parser.new(LocationsXMLImport.new)
    @parser.parse(File.read(file))

  end

end
