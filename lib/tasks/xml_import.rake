namespace :xml_import do

  desc "incremental import of data"
  task :incremental, [:file] => :environment do |task,args|
    file = args[:file] || ARGV[0]
    require 'nokogiri'

    raise "No xml file supplied (file=...). Please provide a valid xml filename." unless File.exists?(file)

    @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
    @parser.parse(File.read(file))

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