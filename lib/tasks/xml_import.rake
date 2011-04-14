namespace :xml_import do

  desc "incremental import of data"
  task :incremental, [:file] => :environment do |task,args|
    file = args[:file] || ARGV[0]
    require 'nokogiri'

    raise "No xml file supplied (file=...). Please provide a valid xml filename." unless File.exists?(file)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
    @parser.parse(File.read(file))

    archive_id = (file.split('/').last[/za\d{3}/i] || '').downcase
    unless Interview.find_by_archive_id(archive_id).nil?
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
    Dir.glob(File.join(repo_dir, '**', '*.xml')).each do |xmlfile|
      Open4::popen4("rake xml_import:incremental file=#{xmlfile} --trace") do |pid, stdin, stdout, stderr|
        stdout.each_line {|line| puts line }
        errors = []
        stderr.each_line {|line| errors << line unless line.empty?}
        puts "\nImport der Interviewdaten (#{xmlfile.to_s[/za\d{3}/i]} - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
      end
      puts "finished import of #{xmlfile.to_s[/za\d{3}/i]}. Pausing for 90 seconds."
      sleep 90
      puts
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
