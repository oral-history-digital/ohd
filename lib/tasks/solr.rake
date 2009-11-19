namespace :solr do

  desc "starting the Solr server - for testing: this has more verbose output that sunspot:solr:start"
  task :start do

    require 'net/http'
    
    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

    solr_port = solr_config['solr']['port']
    gem_path = File.join(File.dirname(__FILE__), '..', '..', 'vendor', 'gems' )
    solr_path = File.join(Dir.glob(File.join(gem_path, 'sunspot-*')).first, 'solr')

    log_dir = File.join(File.dirname(__FILE__), '..', '..', 'log')

    begin
      n = Net::HTTP.new('127.0.0.1', solr_port)
      n.request_head('/').value

    rescue Net::HTTPServerException #responding
      puts "Port #{solr_port} in use" and return

    rescue Errno::ECONNREFUSED #not responding
      Dir.chdir(solr_path) do
        pid = fork do
          #STDERR.close
          exec "java -Dsolr.data.dir=#{File.join(log_dir, '..', 'solr', 'data')} -Djetty.logs=#{log_dir} -Djetty.port=#{solr_port} -jar start.jar"
        end
        sleep(5)
        File.open("#{log_dir}/#{ENV['RAILS_ENV']}_pid", "w"){ |f| f << pid}
        puts "#{ENV['RAILS_ENV']} Solr started successfully on #{solr_port}, pid: #{pid}."
      end
    end

  end

  desc "initializes the Solr connection"
  task :connect => :environment do

    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

    SOLR = RSolr.connect :url => "http://#{solr_config['solr']['hostname']}:#{solr_config['solr']['port']}/solr"

  end

  desc "delete the index"
  task :delete => :connect do

    puts "\nDeleting index..."

    # clear the index
    SOLR.delete_by_query '*:*'

    puts "done"

  end

  desc "reindex the archive contents for Solr search"
  task :reindex => :delete do

    BATCH=25
    offset=0
    total = Interview.count :all

    puts "\nReindexing #{total} interviews..."

    while(offset<total)

      Interview.find(:all, :limit => "#{offset},#{BATCH}").each do |interview|
        interview.index
      end

      STDOUT.printf '.'
      STDOUT::flush

      offset += BATCH
    end

    Sunspot.commit

    puts "\nReindexing complete."

  end


end